import { getActiveCompetition } from "@/lib/activeCompetition";
import MatchdaySelector from "@/components/MatchdaySelector";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import MatchResultCard from "@/components/ui/MatchResultCard";
import MatchdayStatusCard from "@/components/ui/MatchdayStatusCard";

type ResultsPageProps = {
  searchParams: Promise<{
    j?: string;
  }>;
};

function statusBadge(status: string) {
  if (status === "finished") return <Badge variant="success">Finalizado</Badge>;
  if (status === "live") return <Badge variant="danger">En juego</Badge>;
  if (status === "closed") return <Badge variant="warning">Cerrada</Badge>;
  return <Badge>Programado</Badge>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const { j } = await searchParams;
  const { supabase, competitionId } = await getActiveCompetition();

  const { data: matchdays, error: matchdaysError } = await supabase
    .from("matchdays")
    .select("id, number")
    .eq("competition_id", competitionId)
    .order("number", { ascending: true });

  if (matchdaysError) {
    return <main>Error: {matchdaysError.message}</main>;
  }

  const selectedMatchdayId = j ?? matchdays?.[0]?.id;

  if (!selectedMatchdayId) {
    return <p>No hay jornadas todavía.</p>;
  }

  const { data: currentMatchday, error } = await supabase
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
        home_goals,
        away_goals,
        status
      )
    `)
    .eq("competition_id", competitionId)
    .eq("id", selectedMatchdayId)
    .single();

  if (error) {
    return <main>Error: {error.message}</main>;
  }

  return (
    <main>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-red-500">
            Jornada
          </p>
          <h1 className="text-4xl font-black">
            Resultados J{currentMatchday.number}
          </h1>
        </div>

        <MatchdaySelector
          matchdays={matchdays ?? []}
          selected={selectedMatchdayId}
        />
      </div>

      <MatchdayStatusCard
        number={currentMatchday.number}
        status={currentMatchday.status}
        firstKickoffAt={currentMatchday.first_kickoff_at}
      />

      <div className="grid gap-3">
        {currentMatchday.matches.map((match) => (
          <MatchResultCard
            key={match.id}
            homeTeam={match.home_team}
            awayTeam={match.away_team}
            homeGoals={match.home_goals}
            awayGoals={match.away_goals}
            kickoffAt={match.kickoff_at}
            status={match.status}
          />
        ))}
      </div>
    </main>
  );
}