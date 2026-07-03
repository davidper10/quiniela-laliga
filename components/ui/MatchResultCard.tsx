import Badge from "@/components/ui/Badge";
import MatchCard from "@/components/match/MatchCard";
import ResultScore from "@/components/match/ResultScore";

type Props = {
  homeTeam: string;
  awayTeam: string;
  homeLogoUrl?: string | null;
  awayLogoUrl?: string | null;
  homeShortName?: string | null;
  awayShortName?: string | null;
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
  homeShortName,
  awayShortName,
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
      homeShortName={homeShortName}
      awayShortName={awayShortName}
      center={<ResultScore homeGoals={homeGoals} awayGoals={awayGoals} />}
      footer={
        <div className="flex flex-col items-center gap-2">
          {finished ? (
            <Badge variant="success">Finalizado</Badge>
          ) : (
            kickoffAt && (
              <p className="text-xs text-zinc-500 sm:text-sm">
                <Badge variant="warning">{new Date(kickoffAt).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}</Badge>
              </p>
            )
          )}
        </div>
      }
    />
  );
}