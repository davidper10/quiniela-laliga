import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function generateToken() {
  return crypto.randomUUID().slice(0, 8).toUpperCase();
}

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("active_competition_id")
    .eq("id", user.id)
    .single();

  if (!profile?.active_competition_id) {
    return NextResponse.json(
      { error: "No hay competición activa" },
      { status: 400 }
    );
  }

  const competitionId = profile.active_competition_id;

  const { data: membership } = await supabase
    .from("competition_members")
    .select("role")
    .eq("competition_id", competitionId)
    .eq("user_id", user.id)
    .single();

  if (!membership || membership.role !== "admin") {
    return NextResponse.json({ error: "Solo admin" }, { status: 403 });
  }

  const token = generateToken();

  const { data: invite, error } = await supabase
    .from("competition_invites")
    .insert({
      competition_id: competitionId,
      token,
      created_by: user.id,
      expires_at: null,
    })
    .select("token")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    token: invite.token,
  });
}