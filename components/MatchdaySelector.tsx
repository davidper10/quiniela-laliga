"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Matchday = {
  id: string;
  number: number;
};

export default function MatchdaySelector({
  matchdays,
  selected,
}: {
  matchdays: Matchday[];
  selected: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function change(value: string) {
    const params = new URLSearchParams(searchParams);

    params.set("j", value);

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={selected}
      onChange={(e) => change(e.target.value)}
      className="rounded border p-2"
    >
      {matchdays.map((m) => (
        <option key={m.id} value={m.id}>
          Jornada {m.number}
        </option>
      ))}
    </select>
  );
}