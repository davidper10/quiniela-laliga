export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-xl
        ${className}
      `}
    >
      {children}
    </div>
  );
}