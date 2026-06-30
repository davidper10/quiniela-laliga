import { SupabaseClient } from "@supabase/supabase-js";

type RankingMode = "global" | "jornada";

export type RankingRow = {
  userId: string;
  username: string;
  points: number;
  exactHits: number;
  partialHits: number;
};

export async function getRanking({
  supabase,
  competitionId,
  mode = "global",
  matchdayId,
}: {
  supabase: SupabaseClient;
  competitionId: string;
  mode?: RankingMode;
  matchdayId?: string;
}): Promise<RankingRow[]> {
  let scoresQuery = supabase
    .from("scores")
    .select(`
      points,
      exact_score,
      one_team_score,
      correct_outcome,
      correct_goal_diff,
      user_id,
      profiles (
        username
      ),
      matches!inner (
        matchday_id
      )
    `)
    .eq("competition_id", competitionId);

  if (mode === "jornada" && matchdayId) {
    scoresQuery = scoresQuery.eq("matches.matchday_id", matchdayId);
  }

  const { data: scores, error } = await scoresQuery;

  if (error) {
    throw new Error(error.message);
  }

  const totals = new Map<string, RankingRow>();

  scores?.forEach((score) => {
    const username = score.profiles?.username ?? "Usuario";

    const current = totals.get(score.user_id) ?? {
      userId: score.user_id,
      username,
      points: 0,
      exactHits: 0,
      partialHits: 0,
    };

    current.points += score.points;

    if (score.exact_score) {
      current.exactHits += 1;
    }

    if (
      score.one_team_score ||
      score.correct_outcome ||
      score.correct_goal_diff
    ) {
      current.partialHits += 1;
    }

    totals.set(score.user_id, current);
  });

  return Array.from(totals.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.exactHits !== a.exactHits) return b.exactHits - a.exactHits;
    if (b.partialHits !== a.partialHits) return b.partialHits - a.partialHits;
    return a.username.localeCompare(b.username);
  });
}