"use client";

import Button from "@/components/ui/Button";
import { useState } from "react";
import { toast } from "sonner";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import MatchPredictionCard from "@/components/ui/MatchPredictionCard";

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
      toast.error(result.error ?? "Error guardando pronósticos");
      return;
    }

    toast.success("Pronósticos guardados");
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <MatchPredictionCard
          key={match.id}
          homeTeam={match.home_team}
          awayTeam={match.away_team}
          homeValue={values[match.id].home}
          awayValue={values[match.id].away}
          disabled={isClosed}
          onHomeChange={(value) =>
            setValues({
              ...values,
              [match.id]: {
                ...values[match.id],
                home: value,
              },
            })
          }
          onAwayChange={(value) =>
            setValues({
              ...values,
              [match.id]: {
                ...values[match.id],
                away: value,
              },
            })
          }
        />
      ))}

      <Button onClick={savePredictions} disabled={isClosed}>
        {isClosed ? "Jornada cerrada 🔒" : "Guardar pronósticos"}
      </Button>
    </div>
  );
}