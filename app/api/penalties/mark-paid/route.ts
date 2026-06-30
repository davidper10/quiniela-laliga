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

  const { penaltyId } = await req.json();

  if (!penaltyId) {
    return NextResponse.json({ error: "Falta penaltyId" }, { status: 400 });
  }

  const { data: penalty } = await supabase
    .from("penalties")
    .select("id, competition_id")
    .eq("id", penaltyId)
    .single();

  if (!penalty) {
    return NextResponse.json({ error: "Multa no encontrada" }, { status: 404 });
  }

  const { data: membership } = await supabase
    .from("competition_members")
    .select("role")
    .eq("competition_id", penalty.competition_id)
    .eq("user_id", user.id)
    .single();

  if (!membership || membership.role !== "admin") {
    return NextResponse.json({ error: "Solo admin" }, { status: 403 });
  }

  const { error } = await supabase
    .from("penalties")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", penaltyId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}