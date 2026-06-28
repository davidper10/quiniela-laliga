import Input from "@/components/ui/Input";
import TeamCrest from "./TeamCrest";

type Props = {
  homeTeam: string;
  awayTeam: string;
  homeValue: string;
  awayValue: string;
  disabled?: boolean;
  onHomeChange: (value: string) => void;
  onAwayChange: (value: string) => void;
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

export default function MatchPredictionCard({
  homeTeam,
  awayTeam,
  homeValue,
  awayValue,
  disabled = false,
  onHomeChange,
  onAwayChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 shadow-xl">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <TeamCrest team={homeTeam} />
          <p className="hidden truncate font-black lg:block">{homeTeam}</p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Input
            className="h-12 w-14 px-0 text-center text-xl font-black sm:h-16 sm:w-20 sm:text-3xl"
            type="number"
            min="0"
            disabled={disabled}
            value={homeValue}
            onChange={(e) => onHomeChange(e.target.value)}
          />

          <span className="text-lg font-black text-white sm:text-2xl">-</span>

          <Input
            className="h-12 w-14 px-0 text-center text-xl font-black sm:h-16 sm:w-20 sm:text-3xl"
            type="number"
            min="0"
            disabled={disabled}
            value={awayValue}
            onChange={(e) => onAwayChange(e.target.value)}
          />
        </div>

        <div className="flex min-w-0 items-center justify-end gap-3">
          <p className="hidden truncate text-right font-black lg:block">
            {awayTeam}
          </p>
          <TeamCrest team={awayTeam} />
        </div>
      </div>
    </div>
  );
}