"use client";

import { useState } from "react";

type Match = {
  id: string;
  home_team: string;
  away_team: string;
  kickoff_at: string;
};

type Prediction = {
  match_id: string;
  predicted_home_goals: number;
  predicted_away_goals: number;
};

export default function PredictionsForm({
  competitionId,
  matchdayId,
  matches,
  initialPredictions,
  isClosed,
}: {
  competitionId: string;
  matchdayId: string;
  matches: Match[];
  initialPredictions: Prediction[];
  isClosed: boolean;
}) {
  const [values, setValues] = useState<Record<string, { home: string; away: string }>>(
    Object.fromEntries(
      matches.map((match) => {
        const prediction = initialPredictions.find((p) => p.match_id === match.id);

        return [
          match.id,
          {
            home: prediction?.predicted_home_goals?.toString() ?? "",
            away: prediction?.predicted_away_goals?.toString() ?? "",
          },
        ];
      })
    )
  );

  async function savePredictions() {
    const predictions = matches.map((match) => ({
      matchId: match.id,
      homeGoals: Number(values[match.id].home),
      awayGoals: Number(values[match.id].away),
    }));

    const response = await fetch("/api/predictions/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        competitionId,
        matchdayId,
        predictions,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error ?? "Error guardando pronósticos");
      return;
    }

    alert("Pronósticos guardados");
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div key={match.id} className="rounded border p-4">
          <p className="mb-2 font-medium">
            {match.home_team} - {match.away_team}
          </p>

          {isClosed && (
            <p className="rounded bg-yellow-100 p-3 text-sm">
              La jornada ya está cerrada. No se pueden modificar pronósticos.
            </p>
          )}
          
          <div className="flex items-center gap-2">
            <input
              className="w-16 rounded border p-2"
              type="number"
              min="0"
              value={values[match.id].home}
              disabled={isClosed}
              onChange={(e) =>
                setValues({
                  ...values,
                  [match.id]: {
                    ...values[match.id],
                    home: e.target.value,
                  },
                })
              }
            />

            <span>-</span>

            <input
              className="w-16 rounded border p-2"
              type="number"
              min="0"
              value={values[match.id].away}
              disabled={isClosed}
              onChange={(e) =>
                setValues({
                  ...values,
                  [match.id]: {
                    ...values[match.id],
                    away: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      ))}

      <button
        onClick={savePredictions}
        disabled={isClosed}
        className="rounded bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isClosed ? "Jornada cerrada 🔒" : "Guardar pronósticos"}
      </button>
    </div>
  );
}