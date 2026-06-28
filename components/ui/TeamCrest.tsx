import Image from "next/image";

export default function TeamCrest({
  team,
  logoUrl,
}: {
  team: string;
  logoUrl?: string | null;
}) {
  const initials = team
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-zinc-900 text-sm font-black sm:h-14 sm:w-14 sm:text-lg">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={team}
          width={56}
          height={56}
          className="h-full w-full object-contain p-1"
        />
      ) : (
        initials
      )}
    </div>
  );
}