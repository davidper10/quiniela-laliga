import MatchCard from "@/components/match/MatchCard";
import PredictionScoreInputs from "@/components/match/PredictionScoreInputs";

type Props = {
  homeTeam: string;
  awayTeam: string;
  homeValue: string;
  awayValue: string;
  disabled?: boolean;
  onHomeChange: (value: string) => void;
  onAwayChange: (value: string) => void;
};

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
    <MatchCard
      homeTeam={homeTeam}
      awayTeam={awayTeam}
      center={
        <PredictionScoreInputs
          homeValue={homeValue}
          awayValue={awayValue}
          disabled={disabled}
          onHomeChange={onHomeChange}
          onAwayChange={onAwayChange}
        />
      }
    />
  );
}