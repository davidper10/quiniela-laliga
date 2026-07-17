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

  const { name, season } = await req.json();

  if (!name || !season) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  function generateInviteCode() {
    return crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();
  }

  const inviteCode = generateInviteCode();

  const { data: competition, error: competitionError } = await supabase
    .from("competitions")
    .insert({
      name,
      season,
      admin_user_id: user.id,
      invite_code: inviteCode,
    })
    .select("id, invite_code")
    .single();

  if (competitionError) {
    return NextResponse.json(
      { error: competitionError.message },
      { status: 500 }
    );
  }

  const { error: memberError } = await supabase
    .from("competition_members")
    .insert({
      competition_id: competition.id,
      user_id: user.id,
      role: "admin",
    });

  if (memberError) {
    return NextResponse.json(
      { error: memberError.message },
      { status: 500 }
    );
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      active_competition_id: competition.id,
    })
    .eq("id", user.id);

  if (profileError) {
    return NextResponse.json(
      { error: profileError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    competitionId: competition.id,
    inviteCode: competition.invite_code,
  });
}