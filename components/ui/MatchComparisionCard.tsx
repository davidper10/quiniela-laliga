import MatchCard from "@/components/match/MatchCard";
import ResultScore from "@/components/match/ResultScore";

type Props = {
  homeTeam: string;
  awayTeam: string;
  homeGoals?: number | null;
  awayGoals?: number | null;
};

export default function MatchComparisonCard({
  homeTeam,
  awayTeam,
  homeGoals,
  awayGoals,
}: Props) {
  return (
    <MatchCard
      homeTeam={homeTeam}
      awayTeam={awayTeam}
      center={<ResultScore homeGoals={homeGoals} awayGoals={awayGoals} />}
    />
  );
}