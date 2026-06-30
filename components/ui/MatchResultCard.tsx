import Badge from "@/components/ui/Badge";
import MatchCard from "@/components/match/MatchCard";
import ResultScore from "@/components/match/ResultScore";

type Props = {
  homeTeam: string;
  awayTeam: string;
  homeLogoUrl?: string | null;
  awayLogoUrl?: string | null;
  homeGoals?: number | null;
  awayGoals?: number | null;
  kickoffAt?: string;
  status?: string;
};

export default function MatchResultCard({
  homeTeam,
  awayTeam,
  homeLogoUrl,
  awayLogoUrl,
  homeGoals,
  awayGoals,
  kickoffAt,
  status = "scheduled",
}: Props) {
  const finished = status === "finished";

  return (
    <MatchCard
      homeTeam={homeTeam}
      awayTeam={awayTeam}
      homeLogoUrl={homeLogoUrl}
      awayLogoUrl={awayLogoUrl}
      center={<ResultScore homeGoals={homeGoals} awayGoals={awayGoals} />}
      footer={
        <div className="flex flex-col items-center gap-2">
          {/*kickoffAt && (
            <p className="text-xs text-zinc-500 sm:text-sm">
              {new Date(kickoffAt).toLocaleString("es-ES")}
            </p>
          )*/}

          <Badge variant={finished ? "success" : "default"}>
            {finished ? "Finalizado" : status}
          </Badge>
        </div>
      }
    />
  );
}