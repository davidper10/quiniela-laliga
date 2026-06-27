type BadgeVariant = "default" | "success" | "warning" | "danger" | "admin";

export default function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  const variants = {
    default: "border-white/15 bg-white/5 text-zinc-300",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
    danger: "border-red-500/30 bg-red-500/10 text-red-400",
    admin: "border-red-500/40 bg-red-600 text-white",
  };

  return (
    <span
      className={`rounded-md border px-2 py-1 text-xs font-bold uppercase ${variants[variant]}`}
    >
      {children}
    </span>
  );
}