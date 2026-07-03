import { getActiveCompetition } from "@/lib/activeCompetition";
import MatchdaySelector from "@/components/MatchdaySelector";
import ComparisonSelector from "./ComparisionSelector";

type Props = {
  searchParams: Promise<{
    j?: string;
  }>;
};

export default async function ComparisonPage({
  searchParams,
}: Props) {
  const { j } = await searchParams;

  const { supabase, competitionId } =
    await getActiveCompetition();

  const { data: matchdays } = await supabase
    .from("matchdays")
    .select("id,number")
    .eq("competition_id", competitionId)
    .order("number");

  const selectedMatchdayId =
    j ??
    matchdays?.[0]?.id;

  if (!selectedMatchdayId) {
    return (
      <main className="p-6">
        No hay jornadas
      </main>
    );
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
        kickoff_at,
        home_goals,
        away_goals,
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
      )
    `)
    .eq("id", selectedMatchdayId)
    .single();

  if (!matchday) {
    return (
      <main className="p-6">
        No encontrada
      </main>
    );
  }

  const matches = matchday.matches.map((match) => ({
    ...match,
    home: Array.isArray(match.home) ? match.home[0] : match.home,
    away: Array.isArray(match.away) ? match.away[0] : match.away,
  }));

  const firstKickoffAt =
    matches
      .map((m) => new Date(m.kickoff_at))
      .sort((a, b) => a.getTime() - b.getTime())[0];

  const isClosed =
    matchday.status === "closed" ||
    matchday.status === "finished" ||
    new Date() >= firstKickoffAt;


  if (!isClosed) {
    return (
        <main>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-sm font-bold uppercase tracking-widest text-red-500">
                Comparador
                </p>

                <h1 className="text-4xl font-black">
                Pronósticos J{matchday.number}
                </h1>
            </div>

            <MatchdaySelector
                matchdays={matchdays ?? []}
                selected={selectedMatchdayId}
            />
            </div>

            <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-yellow-300">
            El comparador estará disponible cuando empiece la jornada.
            </div>
        </main>
        );
  }


  const matchIds =
    matchday.matches.map(
      m=>m.id
    );


  const { data: predictions } =
    await supabase

    .from("predictions")

    .select(`
      predicted_home_goals,
      predicted_away_goals,
      match_id,

      profiles(
        username
      )

    `)

    .eq(
      "competition_id",
      competitionId
    )

    .in(
      "match_id",
      matchIds
    );

    return (
        <main>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-sm font-bold uppercase tracking-widest text-red-500">
                Comparador
                </p>

                <h1 className="text-4xl font-black">
                Pronósticos J{matchday.number}
                </h1>

                <p className="mt-2 text-sm text-zinc-400">
                Consulta qué ha puesto cada participante cuando la jornada esté cerrada.
                </p>
            </div>

            <MatchdaySelector
                matchdays={matchdays ?? []}
                selected={selectedMatchdayId}
            />
            </div>

            <ComparisonSelector
              matches={matches}
              predictions={predictions ?? []}
            />
        </main>
        );

}