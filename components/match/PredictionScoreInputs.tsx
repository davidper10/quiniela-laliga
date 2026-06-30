import Input from "@/components/ui/Input";

export default function PredictionScoreInputs({
  homeValue,
  awayValue,
  disabled,
  onHomeChange,
  onAwayChange,
}: {
  homeValue: string;
  awayValue: string;
  disabled?: boolean;
  onHomeChange: (value: string) => void;
  onAwayChange: (value: string) => void;
}) {
  return (
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
  );
}