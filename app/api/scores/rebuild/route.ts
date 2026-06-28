import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculatePoints } from "@/lib/scoring";
import { generatePenalties } from "@/lib/penalties";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { competitionId, matchdayId } = await request.json();

  if (!competitionId) {
    return NextResponse.json({ error: "Falta competitionId" }, { status: 400 });
  }

  const { data: membership } = await supabase
    .from("competition_members")
    .select("role")
    .eq("competition_id", competitionId)
    .eq("user_id", user.id)
    .single();

  if (!membership || membership.role !== "admin") {
    return NextResponse.json({ error: "Solo admin" }, { status: 403 });
  }

  const { data: predictions, error } = await supabase
    .from("predictions")
    .select(`
      competition_id,
      user_id,
      match_id,
      predicted_home_goals,
      predicted_away_goals,
      matches (
        home_goals,
        away_goals,
        status
      )
    `)
    .eq("competition_id", competitionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows =
    predictions
      ?.filter((prediction) => {
        const match = Array.isArray(prediction.matches)
          ? prediction.matches[0]
          : prediction.matches;

        return (
          match?.status === "finished" &&
          match.home_goals !== null &&
          match.away_goals !== null
        );
      })
      .map((prediction) => {
        const match = Array.isArray(prediction.matches)
          ? prediction.matches[0]
          : prediction.matches;

        const result = calculatePoints(
          prediction.predicted_home_goals,
          prediction.predicted_away_goals,
          match.home_goals,
          match.away_goals
        );

        return {
          competition_id: prediction.competition_id,
          user_id: prediction.user_id,
          match_id: prediction.match_id,
          points: result.points,
          exact_score: result.exactScore,
          one_team_score: result.oneTeamScore,
          correct_outcome: result.correctOutcome,
          correct_goal_diff: result.correctGoalDiff,
          calculated_at: new Date().toISOString(),
        };
      }) ?? [];

  if (rows.length === 0) {
    return NextResponse.json({ ok: true, updated: 0 });
  }

  let penaltiesCreated = 0;

  if (matchdayId) {
    const result = await generatePenalties({
      supabase,
      competitionId,
      matchdayId,
    });

    penaltiesCreated = result.created;
  }

  const { error: upsertError } = await supabase.from("scores").upsert(rows, {
    onConflict: "competition_id,user_id,match_id",
  });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    updated: rows.length,
    penaltiesCreated,
  });
}