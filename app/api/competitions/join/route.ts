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

  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: "Falta código" }, { status: 400 });
  }

  const normalizedCode = String(code).trim().toUpperCase();

  console.log("Código recibido:", normalizedCode);

  const { data: competition, error: competitionError } = await supabase
    .from("competitions")
    .select("id")
    .eq("invite_code", normalizedCode)
    .single();

  console.log({
    competition,
    competitionError,
  });

  if (competitionError || !competition) {
    return NextResponse.json({ error: "Código inválido" }, { status: 404 });
  }

  const { error: memberError } = await supabase
    .from("competition_members")
    .upsert(
      {
        competition_id: competition.id,
        user_id: user.id,
        role: "member",
      },
      {
        onConflict: "competition_id,user_id",
      }
    );

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  await supabase
    .from("profiles")
    .update({
      active_competition_id: competition.id,
    })
    .eq("id", user.id);

  return NextResponse.json({ ok: true });
}