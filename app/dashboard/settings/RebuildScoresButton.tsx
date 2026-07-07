"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function RebuildScoresButton({
  competitionId,
  matchdayId,
}: {
  competitionId: string;
  matchdayId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function rebuild() {
    setLoading(true);

    const response = await fetch("/api/scores/rebuild", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        competitionId,
        matchdayId,
      }),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      alert(result.error ?? "Error recalculando");
      return;
    }
    console.log("Multas generadas: ", result.penaltiesCreated);
    alert(
      `Puntuaciones actualizadas: ${result.updated}. Multas generadas: ${result.penaltiesCreated}`
    );
  }

  return (
    <Button onClick={rebuild} disabled={loading} variant="secondary">
      {loading ? "Calculando..." : "Recalcular jornada"}
    </Button>
  );
}
