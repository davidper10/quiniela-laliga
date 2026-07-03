import { getActiveCompetition } from "@/lib/activeCompetition";
import MatchdaySelector from "@/components/MatchdaySelector";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getRanking } from "@/lib/ranking";

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

  const ranking = await getRanking({
    supabase,
    competitionId,
    mode,
    matchdayId: selectedMatchdayId,
});

  function getPenaltyForPosition(position: number) {
    return penaltiesConfig?.find((p) => p.position === position);
}

  return (
    <main>
        <div className="mb-6 flex flex-col gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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

                <div className="rounded-2xl border border-white/10 bg-black p-1">
                <div className="grid grid-cols-2 gap-1">
                    <a
                    href="/dashboard/rankings?mode=global"
                    className={`rounded-xl px-6 py-3 text-center text-sm font-black transition ${
                        mode === "global"
                        ? "bg-red-600 text-white"
                        : "text-zinc-500 hover:text-white"
                    }`}
                    >
                    Global
                    </a>

                    <a
                    href={`/dashboard/rankings?mode=jornada${
                        selectedMatchdayId ? `&j=${selectedMatchdayId}` : ""
                    }`}
                    className={`rounded-xl px-6 py-3 text-center text-sm font-black transition ${
                        mode === "jornada"
                        ? "bg-red-600 text-white"
                        : "text-zinc-500 hover:text-white"
                    }`}
                    >
                    Por Jornada
                    </a>
                </div>
                </div>
            </div>

            {mode === "jornada" && selectedMatchdayId && (
                <MatchdaySelector
                matchdays={matchdays ?? []}
                selected={selectedMatchdayId}
                />
            )}
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