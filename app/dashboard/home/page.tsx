import { getActiveCompetition } from "@/lib/activeCompetition";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getRanking } from "@/lib/ranking";
import MatchCard from "@/components/match/MatchCard";
import StatCard from "@/components/dashboard/StatCard";
import Link from "next/link";

export default async function HomePage() {
  const { supabase, competitionId, user, competition } =
    await getActiveCompetition();

  const { data: matchday } = await supabase
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
    .order("number", { ascending: true })
    .limit(1)
    .single();

  if (!matchday) {
    return <main>No hay jornadas todavía.</main>;
  }

  const matches = matchday.matches.map((match) => ({
    ...match,
    home: Array.isArray(match.home) ? match.home[0] : match.home,
    away: Array.isArray(match.away) ? match.away[0] : match.away,
  }));

  const totalMatches = matches.length;

  const { count: predictionsCount } = await supabase
    .from("predictions")
    .select("*", { count: "exact", head: true })
    .eq("competition_id", competitionId)
    .eq("user_id", user.id)
    .in(
      "match_id",
      matches.map((m) => m.id)
    );

  const nextMatch = matches
    .filter((m) => new Date(m.kickoff_at) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.kickoff_at).getTime() -
        new Date(b.kickoff_at).getTime()
    )[0];

  const isClosed =
    matchday.status === "closed" ||
    matchday.status === "finished" ||
    new Date() >= new Date(matchday.first_kickoff_at);

    const { data: penalties } = await supabase
        .from("penalties")
        .select("amount_eur, status")
        .eq("competition_id", competitionId);

    const pendingPenalties = penalties?.filter((p) => p.status === "pending") ?? [];
    const paidPenalties = penalties?.filter((p) => p.status === "paid") ?? [];

    const pendingTotal = pendingPenalties.reduce(
        (sum, p) => sum + Number(p.amount_eur),
        0
    );

    const potTotal = paidPenalties.reduce(
        (sum, p) => sum + Number(p.amount_eur),
        0
    );

    const ranking = await getRanking({
      supabase,
      competitionId,
      mode: "global",
    });

    const topRanking = ranking.slice(0, 3);

    const { data: penaltiesConfig } = await supabase
        .from("penalties_config")
        .select("position, amount_eur")
        .eq("competition_id", competitionId)
        .order("position", { ascending: true });

    const penaltyZone =
        penaltiesConfig
            ?.map((config) => {
                const user = ranking[config.position - 1];

                if (!user) return null;

                return {
                    position: config.position,
                    amount: Number(config.amount_eur),
                    username: user.username,
                };
            })
            .filter(Boolean) ?? [];

  return (
    <main>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-widest text-red-500">
          Inicio
        </p>

        <h1 className="text-4xl font-black">{competition.name}</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Resumen rápido de la jornada actual.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-red-500">
                  Jornada {matchday.number}
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {isClosed ? "Jornada cerrada" : "Jornada abierta"}
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                  Primer partido:{" "}
                  {new Date(matchday.first_kickoff_at).toLocaleString("es-ES")}
                </p>
              </div>

              <Badge variant={isClosed ? "danger" : "success"}>
                {isClosed ? "Cerrada" : "Abierta"}
              </Badge>
            </div>
          </Card>
        

          <Card>
            <p className="text-sm font-bold uppercase tracking-widest text-red-500">
              Próximo partido
            </p>

            {nextMatch ? (
              <div className="mt-4">
                <MatchCard
                  homeTeam={nextMatch.home?.name ?? nextMatch.home_team}
                  awayTeam={nextMatch.away?.name ?? nextMatch.away_team}
                  homeShortName={nextMatch.home?.short_name}
                  awayShortName={nextMatch.away?.short_name}
                  homeLogoUrl={nextMatch.home?.logo_url}
                  awayLogoUrl={nextMatch.away?.logo_url}
                  center={
                    <div className="rounded-xl bg-red-600 px-4 py-2 font-black">
                      {new Date(nextMatch.kickoff_at).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  }
                />
              </div>
            ) : (
              <p className="mt-4 text-zinc-400">
                No quedan partidos pendientes.
              </p>
            )}
          </Card>
        </div>

        <Card>
          <p className="text-sm font-bold uppercase tracking-widest text-red-500">
            Tus pronósticos
          </p>

          <h2 className="mt-2 text-3xl font-black">
            {predictionsCount ?? 0} / {totalMatches}
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Partidos pronosticados en esta jornada.
          </p>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-red-600"
              style={{
                width: `${
                  totalMatches > 0
                    ? ((predictionsCount ?? 0) / totalMatches) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </Card>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-6">
            <Card>
              <p className="text-sm font-bold uppercase tracking-widest text-red-500">
                Caja
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <StatCard
                  emoji="💰"
                  title="Bote"
                  value={`${potTotal.toFixed(2)}€`}
                />

                <StatCard
                  emoji="⏳"
                  title="Pendiente"
                  value={`${pendingTotal.toFixed(2)}€`}
                  valueColor="text-red-400"
                />
              </div>

              <Link
                href="/dashboard/penalties"
                className="mt-5 block w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Ver Caja →
              </Link>
            </Card>

            <Card>
                <p className="text-sm font-bold uppercase tracking-widest text-red-500">
                    Zona de multa
                </p>

                <div className="mt-4 grid gap-3">
                    {penaltyZone.length === 0 ? (
                    <p className="text-zinc-400">No hay posiciones sancionadas.</p>
                    ) : (
                    penaltyZone.map((item: any) => (
                        <div
                        key={item.position}
                        className="flex items-center justify-between rounded-2xl border border-red-500/30 bg-red-500/10 p-4"
                        >
                        <div>
                            <p className="font-black">
                            Puesto {item.position} · {item.username}
                            </p>
                            <p className="text-sm text-zinc-400">
                            Si termina así, paga multa
                            </p>
                        </div>

                        <p className="text-2xl font-black text-red-400">
                            {item.amount.toFixed(2)}€
                        </p>
                        </div>
                    ))
                    )}
                </div>
            </Card>
          </div>
            <Card className="h-full">
                <p className="text-sm font-bold uppercase tracking-widest text-red-500">
                    Clasificación
                </p>

                <div className="mt-4 grid gap-3">
                    {topRanking.length === 0 ? (
                    <p className="text-zinc-400">Todavía no hay clasificación.</p>
                    ) : (
                    topRanking.map((row, index) => (
                        <div
                        key={row.username}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-black p-4"
                        >
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 font-black">
                            {index + 1}
                            </span>

                            <div>
                            <p className="font-black">{row.username}</p>
                            <p className="text-xs text-zinc-500">
                                Exactos {row.exactHits} · Parciales {row.partialHits}
                            </p>
                            </div>
                        </div>

                        <p className="text-xl font-black">{row.points} pts</p>
                        </div>
                    ))
                    )}
                </div>

                <a
                    href="/dashboard/rankings"
                    className="mt-5 inline-block rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold hover:bg-white/10"
                >
                    Ver clasificación →
                </a>
            </Card>
        </div>
      </div>
    </main>
  );
}