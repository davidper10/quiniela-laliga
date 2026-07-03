type Props = {
  emoji: string;
  title: string;
  value: string;
  valueColor?: string;
};

export default function StatCard({
  emoji,
  title,
  value,
  valueColor = "text-white",
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-2xl">{emoji}</p>

      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
        {title}
      </p>

      <p className={`mt-3 text-3xl font-black ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}