import MatchCard from "@/components/match/MatchCard";
import PredictionScoreInputs from "@/components/match/PredictionScoreInputs";

type Props = {
  homeTeam: string;
  awayTeam: string;
  homeLogoUrl?: string | null;
  awayLogoUrl?: string | null;
  homeShortName?: string | null;
  awayShortName?: string | null;
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
  homeShortName,
  awayShortName,
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
      homeShortName={homeShortName}
      awayShortName={awayShortName}
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