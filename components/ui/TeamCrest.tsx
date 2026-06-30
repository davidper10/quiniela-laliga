import Image from "next/image";

type Props = {
  team: string;
  logoUrl?: string | null;
  size?: number;
};

export default function TeamCrest({
  team,
  logoUrl,
  size = 44,
}: Props) {
  if (logoUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center"
      >
        <Image
          src={logoUrl}
          alt={team}
          width={size}
          height={size}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    );
  }

  const initials = team
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <div
      className="flex items-center justify-center rounded-full bg-red-600 font-black text-white"
      style={{
        width: size,
        height: size,
      }}
    >
      {initials}
    </div>
  );
}