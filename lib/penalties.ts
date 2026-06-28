import { SupabaseClient } from "@supabase/supabase-js";

type GeneratePenaltiesParams = {
  supabase: SupabaseClient;
  competitionId: string;
  matchdayId: string;
};

export async function generatePenalties({
  supabase,
  competitionId,
  matchdayId,
}: GeneratePenaltiesParams) {
  const { data: config, error: configError } = await supabase
    .from("penalties_config")
    .select("position, amount_eur")
    .eq("competition_id", competitionId);

  if (configError) {
    throw new Error(configError.message);
  }

  if (!config || config.length === 0) {
    return { created: 0 };
  }

  const { data: scores, error: scoresError } = await supabase
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
    .eq("competition_id", competitionId)
    .eq("matches.matchday_id", matchdayId);

  if (scoresError) {
    throw new Error(scoresError.message);
  }

  const totals = new Map<
    string,
    {
      userId: string;
      username: string;
      points: number;
      exactHits: number;
      partialHits: number;
    }
  >();

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
    if (score.exact_score) current.exactHits += 1;
    if (
      score.one_team_score ||
      score.correct_outcome ||
      score.correct_goal_diff
    ) {
      current.partialHits += 1;
    }

    totals.set(score.user_id, current);
  });

  const ranking = Array.from(totals.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.exactHits !== a.exactHits) return b.exactHits - a.exactHits;
    if (b.partialHits !== a.partialHits) return b.partialHits - a.partialHits;
    return a.username.localeCompare(b.username);
  });

  const rows = config
    .map((penaltyConfig) => {
      const user = ranking[penaltyConfig.position - 1];

      if (!user) return null;

      return {
        competition_id: competitionId,
        user_id: user.userId,
        matchday_id: matchdayId,
        reason: `Puesto #${penaltyConfig.position} jornada`,
        amount_eur: penaltyConfig.amount_eur,
        status: "pending",
      };
    })
    .filter(Boolean);

  if (rows.length === 0) {
    return { created: 0 };
  }

  const { error: insertError } = await supabase
    .from("penalties")
    .upsert(rows, {
      onConflict: "competition_id,user_id,matchday_id",
      ignoreDuplicates: true,
    });

  if (insertError) {
    throw new Error(insertError.message);
  }

  return { created: rows.length };
}