import { getActiveCompetition } from "@/lib/activeCompetition";
import MatchdaySelector from "@/components/MatchdaySelector";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

type Props = {
  searchParams: Promise<{
    j?: string;
    mode?: "global" | "jornada";
  }>;
};

export default async function RankingsPage({ searchParams }: Props) {
  const { j, mode = "global" } = await searchParams;

  const { supabase, competitionId } = await getActiveCompetition();

  const { data: matchdays } = await supabase
    .from("matchdays")
    .select("id, number")
    .eq("competition_id", competitionId)
    .order("number", { ascending: true });

  const { data: penaltiesConfig } = await supabase
    .from("penalties_config")
    .select("position, amount_eur")
    .eq("competition_id", competitionId);

  const selectedMatchdayId = j ?? matchdays?.[0]?.id;

  let scoresQuery = supabase
    .from("scores")
    .select(`
      points,
      exact_score,
      one_team_score,
      correct_outcome,
      correct_goal_diff,
      user_id,
      profiles (
        username
      ),
      matches!inner (
        matchday_id
      )
    `)
    .eq("competition_id", competitionId);

  if (mode === "jornada" && selectedMatchdayId) {
    scoresQuery = scoresQuery.eq("matches.matchday_id", selectedMatchdayId);
  }

  const { data: scores, error } = await scoresQuery;

  if (error) {
    return <main className="p-6">Error: {error.message}</main>;
  }

  const totals = new Map<
    string,
    {
      username: string;
      points: number;
      exactHits: number;
      partialHits: number;
    }
  >();

  scores?.forEach((score) => {
    const username = score.profiles?.username ?? "Usuario";

    const current = totals.get(score.user_id) ?? {
      username,
      points: 0,
      exactHits: 0,
      partialHits: 0,
    };

    current.points += score.points;
    if (score.exact_score) current.exactHits += 1;
    if (
      score.one_team_score ||
      score.correct_outcome ||
      score.correct_goal_diff
    ) {
      current.partialHits += 1;
    }

    totals.set(score.user_id, current);
  });

  const ranking = Array.from(totals.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.exactHits !== a.exactHits) return b.exactHits - a.exactHits;
    if (b.partialHits !== a.partialHits) return b.partialHits - a.partialHits;
    return a.username.localeCompare(b.username);
  });

  function getPenaltyForPosition(position: number) {
    return penaltiesConfig?.find((p) => p.position === position);
}

  return (
    <main>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <p className="text-sm font-bold uppercase tracking-widest text-red-500">
            Clasificación
            </p>

            <h1 className="text-4xl font-black">
            {mode === "global" ? "Ranking global" : "Ranking jornada"}
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
            Ordenado por puntos, exactos y parciales.
            </p>
        </div>

        {mode === "jornada" && selectedMatchdayId && (
            <MatchdaySelector
            matchdays={matchdays ?? []}
            selected={selectedMatchdayId}
            />
        )}
        </div>

        <div className="mb-6 flex gap-2">
        <a
            href="/dashboard/rankings?mode=global"
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
            mode === "global"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/25"
                : "border border-white/15 bg-white/5 text-zinc-300 hover:bg-white/10"
            }`}
        >
            Global
        </a>

        <a
            href={`/dashboard/rankings?mode=jornada${
            selectedMatchdayId ? `&j=${selectedMatchdayId}` : ""
            }`}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
            mode === "jornada"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/25"
                : "border border-white/15 bg-white/5 text-zinc-300 hover:bg-white/10"
            }`}
        >
            Jornada
        </a>
        </div>

        <div className="grid gap-4">
        {ranking.length === 0 ? (
            <Card>
            <p className="text-zinc-400">
                Todavía no hay puntuaciones calculadas.
            </p>
            </Card>
        ) : (
            ranking.map((row, index) => {
                const position = index + 1;
                const penalty = getPenaltyForPosition(position);

                return (
                    <Card key={row.username}>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-xl font-black">
                            {position}
                        </div>

                        <div>
                            <p className="text-lg font-black">{row.username}</p>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                {penalty && (
                                    <div className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-black text-red-400">
                                        <span>🚨</span>
                                        <span>{Number(penalty.amount_eur).toFixed(2)}€</span>
                                    </div>
                                )}
                                <Badge variant="success">Exactos {row.exactHits}</Badge>
                                <Badge>Parciales {row.partialHits}</Badge>
                            </div>
                        </div>
                        </div>

                        <div className="text-right">
                        <p className="text-3xl font-black text-white">{row.points}</p>
                        <p className="text-xs font-bold uppercase text-zinc-500">
                            puntos
                        </p>
                        </div>
                    </div>
                    </Card>
                );
                })
        )}
        </div>
    </main>
    );
}