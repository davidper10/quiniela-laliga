import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type PredictionInput = {
  matchId: string;
  homeGoals: number;
  awayGoals: number;
};

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await request.json();

  const competitionId = body.competitionId as string;
  const matchdayId = body.matchdayId as string;
  const predictions = body.predictions as PredictionInput[];

  if (!competitionId || !matchdayId || !Array.isArray(predictions)) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { data: membership } = await supabase
    .from("competition_members")
    .select("id")
    .eq("competition_id", competitionId)
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return NextResponse.json(
      { error: "No perteneces a esta competición" },
      { status: 403 }
    );
  }

  const { data: firstMatch, error: firstMatchError } = await supabase
    .from("matches")
    .select("kickoff_at")
    .eq("matchday_id", matchdayId)
    .order("kickoff_at", { ascending: true })
    .limit(1)
    .single();

  if (firstMatchError || !firstMatch) {
    return NextResponse.json(
      { error: "Jornada sin partidos" },
      { status: 400 }
    );
  }

  const now = new Date();
  const deadline = new Date(firstMatch.kickoff_at);

  if (now >= deadline) {
    return NextResponse.json(
      { error: "La jornada ya está cerrada" },
      { status: 403 }
    );
  }

  const rows = predictions.map((prediction) => ({
    competition_id: competitionId,
    user_id: user.id,
    match_id: prediction.matchId,
    predicted_home_goals: prediction.homeGoals,
    predicted_away_goals: prediction.awayGoals,
    updated_at: new Date().toISOString(),
  }));

  const { error: upsertError } = await supabase.from("predictions").upsert(rows, {
    onConflict: "competition_id,user_id,match_id",
  });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}