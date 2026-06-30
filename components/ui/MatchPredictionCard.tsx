import MatchCard from "@/components/match/MatchCard";
import PredictionScoreInputs from "@/components/match/PredictionScoreInputs";

type Props = {
  homeTeam: string;
  awayTeam: string;
  homeLogoUrl?: string | null;
  awayLogoUrl?: string | null;
  homeValue: string;
  awayValue: string;
  disabled?: boolean;
  onHomeChange: (value: string) => void;
  onAwayChange: (value: string) => void;
};

export default function MatchPredictionCard({
  homeTeam,
  awayTeam,
  homeLogoUrl, 
  awayLogoUrl, 
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
      homeLogoUrl={homeLogoUrl}
      awayLogoUrl={awayLogoUrl}
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