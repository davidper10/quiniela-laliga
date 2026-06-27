type Props = {
  homeTeam: string;
  awayTeam: string;
  homeGoals?: number | null;
  awayGoals?: number | null;
};

function crest(team: string) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-sm font-black sm:h-14 sm:w-14 sm:text-lg">
      {team
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    </div>
  );
}

export default function MatchComparisonCard({
  homeTeam,
  awayTeam,
  homeGoals,
  awayGoals,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 shadow-xl">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {crest(homeTeam)}
          <p className="hidden truncate font-black lg:block">{homeTeam}</p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="rounded-xl bg-red-600 px-4 py-2 text-xl font-black sm:px-5 sm:py-3 sm:text-3xl">
            {homeGoals ?? "-"}
          </span>

          <span className="text-lg font-black text-white sm:text-2xl">-</span>

          <span className="rounded-xl bg-red-600 px-4 py-2 text-xl font-black sm:px-5 sm:py-3 sm:text-3xl">
            {awayGoals ?? "-"}
          </span>
        </div>

        <div className="flex min-w-0 items-center justify-end gap-3">
          <p className="hidden truncate text-right font-black lg:block">
            {awayTeam}
          </p>
          {crest(awayTeam)}
        </div>
      </div>
    </div>
  );
}