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

  // aquí moveremos toda la lógica

  return [];
}