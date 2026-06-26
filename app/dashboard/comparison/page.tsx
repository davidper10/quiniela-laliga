import { createClient } from "@/lib/supabase/server";
import ComparisonSelector from "./ComparisionSelector";

type PageProps = {
  searchParams: Promise<{
    competitionId?: string;
  }>;
};

export default async function ComparisonPage({ searchParams }: PageProps) {
  const { competitionId } = await searchParams;
  const supabase = await createClient();

  if (!competitionId) {
    return <main className="p-6">Falta competitionId.</main>;
  }

  const { data: matchday } = await supabase
    .from("matchdays")
    .select(`
      id,
      number,
      status,
      matches (
        id,
        home_team,
        away_team,
        kickoff_at
      )
    `)
    .eq("competition_id", competitionId)
    .order("number", { ascending: true })
    .limit(1)
    .single();

  if (!matchday) {
    return <main className="p-6">No hay jornada.</main>;
  }

  const firstKickoffAt = matchday.matches
    .map((match) => new Date(match.kickoff_at))
    .sort((a, b) => a.getTime() - b.getTime())[0];

  const isClosed =
    matchday.status === "closed" ||
    matchday.status === "finished" ||
    new Date() >= firstKickoffAt;

  if (!isClosed) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="mb-4 text-3xl font-bold">Comparador</h1>
        <p className="rounded bg-yellow-100 p-3">
          El comparador estará disponible cuando empiece la jornada.
        </p>
      </main>
    );
  }

  const matchIds = matchday.matches.map((match) => match.id);

  const { data: predictions, error } = await supabase
    .from("predictions")
    .select(`
      predicted_home_goals,
      predicted_away_goals,
      match_id,
      profiles (
        username
      )
    `)
    .eq("competition_id", competitionId)
    .in("match_id", matchIds);

  if (error) {
    return <main className="p-6">Error: {error.message}</main>;
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-2 text-3xl font-bold">Comparador</h1>
      <p className="mb-6 text-gray-600">Jornada {matchday.number}</p>

      <div className="overflow-x-auto rounded border">
        <ComparisonSelector
            matches={matchday.matches}
            predictions={predictions ?? []}
        />
      </div>
    </main>
  );
}