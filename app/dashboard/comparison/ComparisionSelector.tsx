"use client";

import { useState } from "react";

type Match = {
  id: string;
  home_team: string;
  away_team: string;
};

type Prediction = {
  match_id: string;
  predicted_home_goals: number;
  predicted_away_goals: number;
  profiles: {
    username: string | null;
  } | null;
};

export default function ComparisonSelector({
  matches,
  predictions,
}: {
  matches: Match[];
  predictions: Prediction[];
}) {
  const users = Array.from(
    new Set(predictions.map((p) => p.profiles?.username ?? "Usuario"))
  );

  const [selectedUser, setSelectedUser] = useState(users[0] ?? "");

  const selectedPredictions = predictions.filter(
    (p) => (p.profiles?.username ?? "Usuario") === selectedUser
  );

  return (
    <div className="space-y-6">
      <select
        className="w-full rounded border p-3"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        {users.map((user) => (
          <option key={user} value={user}>
            {user}
          </option>
        ))}
      </select>

      <div className="overflow-x-auto rounded border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left">Partido</th>
              <th className="p-3 text-center">Resultado</th>
            </tr>
          </thead>

          <tbody>
            {matches.map((match) => {
              const prediction = selectedPredictions.find(
                (p) => p.match_id === match.id
              );

              return (
                <tr key={match.id} className="border-b">
                  <td className="p-3">
                    {match.home_team} vs {match.away_team}
                  </td>
                  <td className="p-3 text-center font-medium">
                    {prediction
                      ? `${prediction.predicted_home_goals} - ${prediction.predicted_away_goals}`
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}