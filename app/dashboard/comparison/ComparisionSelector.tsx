"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import MatchComparisonCard from "@/components/ui/MatchComparisionCard";

type Match = {
  id: string;
  home_team: string;
  away_team: string;
  home?: {
    name: string;
    short_name: string;
    logo_url: string | null;
  } | null;
  away?: {
    name: string;
    short_name: string;
    logo_url: string | null;
  } | null;
};
type Prediction = {
  match_id: string;
  predicted_home_goals: number;
  predicted_away_goals: number;
  profiles:
    | {
        username: string | null;
      }
    | {
        username: string | null;
      }[]
    | null;
};

export default function ComparisonSelector({
  matches,
  predictions,
}: {
  matches: Match[];
  predictions: Prediction[];
}) {
  const users = Array.from(
    new Set(
      predictions.map((prediction) => {
        const profile = Array.isArray(prediction.profiles)
          ? prediction.profiles[0]
          : prediction.profiles;

        return profile?.username ?? "Usuario";
      })
    )
  );

  const [selectedUser, setSelectedUser] = useState(users[0] ?? "");

  const selectedPredictions = predictions.filter((prediction) => {
    const profile = Array.isArray(prediction.profiles)
      ? prediction.profiles[0]
      : prediction.profiles;

    return (profile?.username ?? "Usuario") === selectedUser;
  });

  return (
    <div className="space-y-6">
      <Select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="w-full max-w-sm"
      >
        {users.map((user) => (
          <option key={user} value={user}>
            {user}
          </option>
        ))}
      </Select>

      <div className="grid gap-4">
        {matches.map((match) => {
          const prediction = selectedPredictions.find(
            (p) => p.match_id === match.id
          );

          return (
            <MatchComparisonCard
              key={match.id}
              homeTeam={match.home?.name ?? match.home_team}
              awayTeam={match.away?.name ?? match.away_team}
              homeLogoUrl={match.home?.logo_url}
              awayLogoUrl={match.away?.logo_url}
              homeShortName={match.home?.short_name}
              awayShortName={match.away?.short_name}
              homeGoals={prediction?.predicted_home_goals}
              awayGoals={prediction?.predicted_away_goals}
            />
          );
        })}
      </div>
    </div>
  );
}