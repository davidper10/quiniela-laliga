import MatchCard from "@/components/match/MatchCard";
import ResultScore from "@/components/match/ResultScore";

type Props = {
  homeTeam: string;
  awayTeam: string;
  homeLogoUrl?: string | null;
  awayLogoUrl?: string | null;
  homeGoals?: number | null;
  awayGoals?: number | null;
};

export default function MatchComparisonCard({
  homeTeam,
  awayTeam,
  homeLogoUrl, 
  awayLogoUrl,
  homeGoals,
  awayGoals,
}: Props) {
  return (
    <MatchCard
      homeTeam={homeTeam}
      awayTeam={awayTeam}
      homeLogoUrl={homeLogoUrl}
      awayLogoUrl={awayLogoUrl}
      center={<ResultScore homeGoals={homeGoals} awayGoals={awayGoals} />}
    />
  );
}