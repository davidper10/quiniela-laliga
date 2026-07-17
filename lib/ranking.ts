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
}): 
  Promise<RankingRow[]> {
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
    const profile = Array.isArray(score.profiles)
      ? score.profiles[0]
      : score.profiles;
    const usernameFromRow = profile?.username;

    const existing = totals.get(score.user_id);

    if (existing) {
      // accumulate points and hits
      existing.points += score.points ?? 0;

      if (score.exact_score) existing.exactHits += 1;

      if (
        score.one_team_score ||
        score.correct_outcome ||
        score.correct_goal_diff
      ) {
        existing.partialHits += 1;
      }

      // update username if we previously had placeholder but now have real name
      if (usernameFromRow && (!existing.username || existing.username === "Usuario")) {
        existing.username = usernameFromRow;
      }

      totals.set(score.user_id, existing);
    } else {
      const username = usernameFromRow ?? "Usuario";

      const newRow: RankingRow = {
        userId: score.user_id,
        username,
        points: score.points ?? 0,
        exactHits: score.exact_score ? 1 : 0,
        partialHits:
          score.one_team_score || score.correct_outcome || score.correct_goal_diff
            ? 1
            : 0,
      };

      totals.set(score.user_id, newRow);
    }
  });

  const ranking = Array.from(totals.values());

  const { data: members, error: membersError } = await supabase
    .from("competition_members")
    .select(`
      user_id,
      profiles (
        username,
        display_name
      )
    `)
    .eq("competition_id", competitionId);

  if (membersError) {
    throw new Error(membersError.message);
  }

  members?.forEach((member) => {
    if (!totals.has(member.user_id)) {
      const memberProfile = Array.isArray(member.profiles)
        ? member.profiles[0]
        : member.profiles;

      ranking.push({
        userId: member.user_id,
        username:
          memberProfile?.display_name ?? memberProfile?.username ?? "Usuario",
        points: 0,
        exactHits: 0,
        partialHits: 0,
      });
    }
  });

  return ranking.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.exactHits !== a.exactHits) return b.exactHits - a.exactHits;
    if (b.partialHits !== a.partialHits) return b.partialHits - a.partialHits;
    return a.username.localeCompare(b.username);
  });
}