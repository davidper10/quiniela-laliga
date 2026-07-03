import { getActiveCompetition } from "@/lib/activeCompetition";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import MatchEditor from "./MatchEditor";

type Props = {
  params: Promise<{
    matchId: string;
  }>;
};

export default async function AdminMatchPage({ params }: Props) {
  const { matchId } = await params;
  const { supabase, competitionId } = await getActiveCompetition();

  const { data: match, error } = await supabase
    .from("matches")
    .select(`
      id,
      matchday_id,
      home_team,
      away_team,
      home_goals,
      away_goals,
      kickoff_at,
      status,
      matchdays (
        number,
        competition_id
      ),
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
    `)
    .eq("id", matchId)
    .single();

  if (error || !match) {
    return <main>Error cargando partido.</main>;
  }

  if (match.matchdays?.competition_id !== competitionId) {
    return <main>No tienes acceso a este partido.</main>;
  }

  return (
    <main>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-widest text-red-500">
          Admin · Jornada {match.matchdays?.number}
        </p>

        <h1 className="text-4xl font-black">Editar partido</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Actualiza goles, fecha, hora y estado del partido.
        </p>
      </div>

      <Card>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">
              {match.home?.name ?? match.home_team}
              <span className="mx-2 text-zinc-500">vs</span>
              {match.away?.name ?? match.away_team}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {new Date(match.kickoff_at).toLocaleString("es-ES")}
            </p>
          </div>

          <Badge>{match.status}</Badge>
        </div>

        <MatchEditor
          matchId={match.id}
          homeTeam={match.home?.name ?? match.home_team}
          awayTeam={match.away?.name ?? match.away_team}
          initialHomeGoals={match.home_goals ?? 0}
          initialAwayGoals={match.away_goals ?? 0}
          initialKickoffAt={match.kickoff_at}
          initialStatus={match.status}
        />
      </Card>
    </main>
  );
}