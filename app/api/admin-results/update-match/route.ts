import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();

  const matchId = body.matchId as string;
  const homeGoals = body.homeGoals as number;
  const awayGoals = body.awayGoals as number;
  const kickoffAt = body.kickoffAt as string;
  const status = body.status as string;

  if (!matchId || !kickoffAt || !status) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { data: match } = await supabase
    .from("matches")
    .select(`
      id,
      matchday_id,
      matchdays (
        competition_id
      )
    `)
    .eq("id", matchId)
    .single();

  if (!match) {
    return NextResponse.json({ error: "Partido no encontrado" }, { status: 404 });
  }

  const competitionId = match.matchdays?.competition_id;

  const { data: membership } = await supabase
    .from("competition_members")
    .select("role")
    .eq("competition_id", competitionId)
    .eq("user_id", user.id)
    .single();

  if (!membership || membership.role !== "admin") {
    return NextResponse.json({ error: "Solo admin" }, { status: 403 });
  }

  const { error } = await supabase
    .from("matches")
    .update({
      home_goals: homeGoals,
      away_goals: awayGoals,
      kickoff_at: kickoffAt,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", matchId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}