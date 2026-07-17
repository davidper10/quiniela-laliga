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
    <div className="flex items-center justify-center gap-2 min-w-0">
      <Input
        className="h-10 w-12 min-w-[3rem] px-0 text-center text-lg font-black sm:h-12 sm:w-16 sm:text-xl"
        type="number"
        min="0"
        disabled={disabled}
        value={homeValue}
        onChange={(e) => onHomeChange(e.target.value)}
      />

      <span className="text-base font-black text-white sm:text-lg">-</span>

      <Input
        className="h-10 w-12 min-w-[3rem] px-0 text-center text-lg font-black sm:h-12 sm:w-16 sm:text-xl"
        type="number"
        min="0"
        disabled={disabled}
        value={awayValue}
        onChange={(e) => onAwayChange(e.target.value)}
      />
    </div>
  );
}