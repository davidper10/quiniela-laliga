"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function MatchEditor({
  matchId,
  homeTeam,
  awayTeam,
  initialHomeGoals,
  initialAwayGoals,
  initialKickoffAt,
  initialStatus,
}: {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  initialHomeGoals: number;
  initialAwayGoals: number;
  initialKickoffAt: string;
  initialStatus: string;
}) {
  const router = useRouter();

  const kickoff = new Date(initialKickoffAt);

  const [homeGoals, setHomeGoals] = useState(initialHomeGoals);
  const [awayGoals, setAwayGoals] = useState(initialAwayGoals);
  const [date, setDate] = useState(kickoff.toISOString().slice(0, 10));
  const [time, setTime] = useState(kickoff.toISOString().slice(11, 16));
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  async function saveChanges(nextStatus?: string) {
    setLoading(true);

    const finalStatus = nextStatus ?? status;
    const kickoffAt = new Date(`${date}T${time}:00`).toISOString();

    const response = await fetch("/api/admin-results/update-match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        matchId,
        homeGoals,
        awayGoals,
        kickoffAt,
        status: finalStatus,
      }),
    });

    const result = await response.json();
    console.log("UPDATE RESULT", result);
    
    setLoading(false);

    if (!response.ok) {
      alert(result.error ?? "Error guardando");
      return;
    }

    if (finalStatus === "finished") {
      router.push("/dashboard/admin-results");
      router.refresh();
      return;
    }

    setStatus(finalStatus);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <p className="mb-2 text-sm font-bold text-zinc-500">{homeTeam}</p>
          <div className="rounded-2xl bg-red-600 px-6 py-4 text-5xl font-black">
            {homeGoals}
          </div>
        </div>

        <span className="text-3xl font-black text-zinc-500">-</span>

        <div className="text-center">
          <p className="mb-2 text-sm font-bold text-zinc-500">{awayTeam}</p>
          <div className="rounded-2xl bg-red-600 px-6 py-4 text-5xl font-black">
            {awayGoals}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button onClick={() => setHomeGoals((v) => v + 1)}>
          Gol local
        </Button>

        <Button onClick={() => setAwayGoals((v) => v + 1)}>
          Gol visitante
        </Button>

        <Button
          variant="secondary"
          onClick={() => setHomeGoals((v) => Math.max(0, v - 1))}
        >
          Quitar gol local
        </Button>

        <Button
          variant="secondary"
          onClick={() => setAwayGoals((v) => Math.max(0, v - 1))}
        >
          Quitar gol visitante
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-bold text-zinc-400">
            Fecha del partido
          </span>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-zinc-400">
            Hora del partido
          </span>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="secondary"
          disabled={loading}
          onClick={() => saveChanges()}
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>

        <Button
          disabled={loading}
          onClick={() => saveChanges("finished")}
        >
          Finalizar partido
        </Button>
      </div>
    </div>
  );
}