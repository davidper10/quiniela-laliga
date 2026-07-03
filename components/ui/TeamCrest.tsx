"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  team: string;
  shortName?: string | null;
  logoUrl?: string | null;
  size?: number;
};

export default function TeamCrest({ team, shortName, logoUrl, size = 44 }: Props) {
  const [hasError, setHasError] = useState(false);

  const initials = team
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  if (logoUrl && !hasError) {
    return (
      <div
        className="flex shrink-0 items-center justify-center"
        style={{ width: size, height: size }}
      >
        <Image
          src={logoUrl}
          alt={team}
          width={size}
          height={size}
          className="max-h-full max-w-full object-contain"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-black text-white"
      style={{ width: size, height: size }}
    >
      {shortName ?? initials}
    </div>
  );
}