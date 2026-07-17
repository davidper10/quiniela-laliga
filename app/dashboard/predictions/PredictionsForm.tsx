"use client";

import Button from "@/components/ui/Button";
import { useState } from "react";
import { toast } from "sonner";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import MatchPredictionCard from "@/components/ui/MatchPredictionCard";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Match = {
  id: string;
  home_team: string;
  away_team: string;
  kickoff_at: string;
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
};

type Member = {
  user_id: string;
  role: string;
  profiles:
    | {
        username: string | null;
        display_name: string | null;
        avatar_url: string | null;
      }
    | {
        username: string | null;
        display_name: string | null;
        avatar_url: string | null;
      }[]
    | null;
};

export default function PredictionsForm({
  competitionId,
  matchdayId,
  matches,
  initialPredictions,
  isClosed,
  isOwnUser,
selectedUserName,
members,
selectedUserId,
}: {
  competitionId: string;
  matchdayId: string;
  matches: Match[];
  initialPredictions: Prediction[];
  isClosed: boolean;
  isOwnUser: boolean;
  selectedUserName: string;
  members: Member[];
  selectedUserId: string;
}) {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const canViewPredictions = isOwnUser || isClosed;

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

  function changeUser(userId: string) {
    const params = new URLSearchParams(searchParams);
    params.set("user", userId);
    router.push(`${pathname}?${params.toString()}`);
  }

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

    setMessage("Pronósticos guardados correctamente");
    toast.success("Pronósticos guardados");
  }

  return (
    <div className="space-y-4">

      <div className="mb-6 rounded-2xl border border-white/10 bg-zinc-950 p-4">
        <div className="flex flex-row flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-bold uppercase tracking-widest text-red-500 min-w-[90px]">
            Usuario
          </p>

          <select
            value={selectedUserId}
            onChange={(e) => changeUser(e.target.value)}
            className="flex-1 min-w-0 rounded-xl border border-white/15 bg-zinc-900 px-4 py-3 text-white font-bold outline-none"
          >
            {members.map((member) => (
              <option
                key={member.user_id}
                value={member.user_id}
                className="bg-zinc-900 text-white"
              >
                {(Array.isArray(member.profiles)
                  ? member.profiles[0]?.display_name
                  : member.profiles?.display_name) ??
                  (Array.isArray(member.profiles)
                    ? member.profiles[0]?.username
                    : member.profiles?.username) ??
                  "Usuario"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!canViewPredictions ? (
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-yellow-300">
          Los pronósticos de otros usuarios estarán disponibles cuando empiece la jornada.
        </div>
      ) : (
        <div className="grid gap-4">
          {matches.map((match) => (
            <MatchPredictionCard
              key={match.id}
              homeTeam={match.home?.name ?? match.home_team}
              awayTeam={match.away?.name ?? match.away_team}
              homeShortName={match.home?.short_name}
              awayShortName={match.away?.short_name}
              homeLogoUrl={match.home?.logo_url}
              awayLogoUrl={match.away?.logo_url}
              homeValue={values[match.id]?.home ?? ""}
              awayValue={values[match.id]?.away ?? ""}
              disabled={isClosed || !isOwnUser}
              onHomeChange={(value) =>
                setValues({
                  ...values,
                  [match.id]: {
                    ...(values[match.id] ?? { home: "", away: "" }),
                    home: value,
                  },
                })
              }
              onAwayChange={(value) =>
                setValues({
                  ...values,
                  [match.id]: {
                    ...(values[match.id] ?? { home: "", away: "" }),
                    away: value,
                  },
                })
              }
            />
          ))}
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-bold text-emerald-400">
          {message}
        </div>
      )}

      {isOwnUser && canViewPredictions && (
        <Button onClick={savePredictions} disabled={isClosed}>
          {isClosed ? "Jornada cerrada 🔒" : "Guardar pronósticos"}
        </Button>
      )}
    </div>
  );
}