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
    <div className="rounded-3xl border border-white/10 bg-zinc-950 p-4">
      <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-bold uppercase tracking-wider text-zinc-400">
        Jornadas
      </span>

      <div className="flex flex-wrap gap-2">
        {matchdays.map((matchday) => {
          const active = selected === matchday.id;

          return (
            <button
              key={matchday.id}
              onClick={() => change(matchday.id)}
              className={`h-10 min-w-10 rounded-xl px-3 text-sm font-black transition ${
                active
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/25"
                  : "border border-white/10 bg-white/5 text-zinc-400 hover:border-red-500 hover:text-white"
              }`}
            >
              J{matchday.number}
            </button>
          );
        })}
      </div>
    </div>
    </div>
  );
}