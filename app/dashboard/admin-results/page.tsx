import Link from "next/link";
import { getActiveCompetition } from "@/lib/activeCompetition";
import MatchdaySelector from "@/components/MatchdaySelector";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getDefaultMatchdayId } from "@/lib/currentMatchday";

type Props = {
  searchParams: Promise<{ j?: string }>;
};

export default async function AdminResultsPage({ searchParams }: Props) {
  const { j } = await searchParams;
  const { supabase, competitionId } = await getActiveCompetition();

  const { data: matchdays } = await supabase
    .from("matchdays")
    .select("id, number, first_kickoff_at, last_kickoff_at, status")
    .eq("competition_id", competitionId)
    .order("number", { ascending: true });

  const selectedMatchdayId = j ?? getDefaultMatchdayId(matchdays ?? []);

  if (!selectedMatchdayId) {
    return <main>No hay jornadas.</main>;
  }

  const { data: matches, error } = await supabase
    .from("matches")
    .select(`
      id,
      home_team,
      away_team,
      home_goals,
      away_goals,
      kickoff_at,
      status,
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
    .eq("matchday_id", selectedMatchdayId)
    .neq("status", "finished")
    .order("kickoff_at", { ascending: true });

  if (error) {
    return <main>Error: {error.message}</main>;
  }

  return (
    <main>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-red-500">
            Admin
          </p>
          <h1 className="text-4xl font-black">Actualizar resultados</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Selecciona una jornada y actualiza los partidos pendientes.
          </p>
        </div>

        <MatchdaySelector
          matchdays={matchdays ?? []}
          selected={selectedMatchdayId}
        />
      </div>

      <div className="grid gap-4">
        {matches?.length === 0 ? (
          <Card>
            <p className="text-zinc-400">
              No hay partidos pendientes en esta jornada.
            </p>
          </Card>
        ) : (
          matches?.map((match) => {
            const home = Array.isArray(match.home) ? match.home[0] : match.home;
            const away = Array.isArray(match.away) ? match.away[0] : match.away;

            return (
              <Link key={match.id} href={`/dashboard/admin-results/${match.id}`}>
                <Card className="transition hover:border-red-500">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-black">
                        {home?.name ?? match.home_team}
                        <span className="mx-2 text-zinc-500">vs</span>
                        {away?.name ?? match.away_team}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {new Date(match.kickoff_at).toLocaleString("es-ES")}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-black text-red-500">
                        {match.home_goals ?? 0} - {match.away_goals ?? 0}
                      </p>
                      <Badge>{match.status}</Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </main>
  );
}