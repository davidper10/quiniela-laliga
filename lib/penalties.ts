import { SupabaseClient } from "@supabase/supabase-js";
import { getRanking } from "@/lib/ranking";

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

  const ranking = await getRanking({
    supabase,
    competitionId,
    mode: "jornada",
    matchdayId,
  });

  type PenaltyRow = {
    competition_id: string;
    user_id: string;
    matchday_id: string;
    reason: string;
    amount_eur: number;
    status: string;
  };

  const rows = config
    .map((penaltyConfig): PenaltyRow | null => {
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
    .filter((row): row is PenaltyRow => row !== null);

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