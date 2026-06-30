export default function ResultScore({
  homeGoals,
  awayGoals,
}: {
  homeGoals?: number | null;
  awayGoals?: number | null;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="rounded-xl bg-red-600 px-4 py-2 text-xl font-black sm:px-5 sm:py-3 sm:text-3xl">
        {homeGoals ?? "-"}
      </span>

      <span className="text-lg font-black text-white sm:text-2xl">-</span>

      <span className="rounded-xl bg-red-600 px-4 py-2 text-xl font-black sm:px-5 sm:py-3 sm:text-3xl">
        {awayGoals ?? "-"}
      </span>
    </div>
  );
}