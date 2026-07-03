import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculatePoints } from "@/lib/scoring";

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { matchId, homeGoals, awayGoals, kickoffAt, status } =
    await req.json();

  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select(`
      id,
      matchdays!inner (
        competition_id
      )
    `)
    .eq("id", matchId)
    .single();

  if (matchError || !match) {
    return NextResponse.json(
      { error: matchError?.message ?? "Partido no encontrado" },
      { status: 404 }
    );
  }

  const competitionId = match.matchdays.competition_id;

  const { data: membership, error: membershipError } = await supabase
    .from("competition_members")
    .select("role")
    .eq("competition_id", competitionId)
    .eq("user_id", user.id)
    .single();

  if (membershipError || membership?.role !== "admin") {
    return NextResponse.json({ error: "Solo admin" }, { status: 403 });
  }

  const { data: updated, error: updateError } = await supabase
    .from("matches")
    .update({
      home_goals: Number(homeGoals),
      away_goals: Number(awayGoals),
      kickoff_at: kickoffAt,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", matchId)
    .select("id, home_goals, away_goals, kickoff_at, status")
    .maybeSingle();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (!updated) {
    return NextResponse.json(
      { error: "No se actualizó ningún partido" },
      { status: 404 }
    );
  }

  if (status === "finished") {
    const { data: predictions } = await supabase
      .from("predictions")
      .select("competition_id, user_id, match_id, predicted_home_goals, predicted_away_goals")
      .eq("match_id", matchId);

    const scoreRows =
      predictions?.map((prediction) => {
        const result = calculatePoints(
          prediction.predicted_home_goals,
          prediction.predicted_away_goals,
          Number(homeGoals),
          Number(awayGoals)
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

    if (scoreRows.length > 0) {
      const { error: scoresError } = await supabase
        .from("scores")
        .upsert(scoreRows, {
          onConflict: "competition_id,user_id,match_id",
        });

      if (scoresError) {
        return NextResponse.json({ error: scoresError.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ ok: true, match: updated });
}