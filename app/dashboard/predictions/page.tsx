import { getActiveCompetition } from "@/lib/activeCompetition";
import MatchdaySelector from "@/components/MatchdaySelector";
import PredictionsForm from "./PredictionsForm";
import MatchdayStatusCard from "@/components/ui/MatchdayStatusCard";

type Props = {
  searchParams: Promise<{
    j?: string;
  }>;
};

export default async function PredictionsPage({ searchParams }: Props) {
  const { j } = await searchParams;

  const { supabase, competitionId, user } = await getActiveCompetition();

  const { data: matchdays, error: matchdaysError } = await supabase
    .from("matchdays")
    .select("id, number")
    .eq("competition_id", competitionId)
    .order("number", { ascending: true });

  if (matchdaysError) {
    return <main className="p-6">Error: {matchdaysError.message}</main>;
  }

  const selectedMatchdayId = j ?? matchdays?.[0]?.id;

  if (!selectedMatchdayId) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="mb-6 text-3xl font-bold">Tus pronósticos</h1>
        <p>No hay jornadas todavía.</p>
      </main>
    );
  }

  const { data: matchday, error: matchdayError } = await supabase
    .from("matchdays")
    .select(`
      id,
      number,
      status,
      first_kickoff_at,
      matches (
        id,
        home_team,
        away_team,
        kickoff_at,
        home:teams!matches_home_team_id_fkey (
            name,
            short_name,
            logo_url
        ),
        away:teams!matches_away_team_id_fkey (
            name,
            short_name,
            logo_url
        )
    )
    `)
    .eq("competition_id", competitionId)
    .eq("id", selectedMatchdayId)
    .single();

  if (matchdayError || !matchday) {
    return <main className="p-6">Error: {matchdayError?.message}</main>;
  }

  const matchIds = matchday.matches.map((match) => match.id);

  const { data: predictions } = await supabase
    .from("predictions")
    .select("match_id, predicted_home_goals, predicted_away_goals")
    .eq("competition_id", competitionId)
    .eq("user_id", user.id)
    .in("match_id", matchIds);

  const firstKickoffAt = matchday.matches
    .map((match) => new Date(match.kickoff_at))
    .sort((a, b) => a.getTime() - b.getTime())[0];

  const isClosed =
    matchday.status === "closed" ||
    matchday.status === "finished" ||
    new Date() >= firstKickoffAt;

  return (
    <main>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <p className="text-sm font-bold uppercase tracking-widest text-red-500">
            Pronósticos
            </p>

            <h1 className="text-4xl font-black">
            Tus resultados J{matchday.number}
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
            {isClosed
                ? "La jornada está cerrada. Ya no puedes modificar tus pronósticos."
                : "Puedes modificar tus pronósticos hasta el inicio del primer partido."}
            </p>
        </div>

        <MatchdaySelector
            matchdays={matchdays ?? []}
            selected={selectedMatchdayId}
        />
        </div>

        <MatchdayStatusCard
            number={matchday.number}
            status={matchday.status}
            firstKickoffAt={matchday.first_kickoff_at}
        />

        <PredictionsForm
            competitionId={competitionId}
            matchdayId={matchday.id}
            matches={matchday.matches}
            initialPredictions={predictions ?? []}
            isClosed={isClosed}
        />
    </main>
    );
}