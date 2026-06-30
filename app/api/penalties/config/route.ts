import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type PenaltyRow = {
  id?: string;
  position: number;
  amount_eur: number;
};

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();

  const competitionId = body.competitionId as string;
  const rows = body.rows as PenaltyRow[];

  if (!competitionId || !Array.isArray(rows)) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
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

  const cleanRows = rows
    .filter((row) => row.position > 0 && row.amount_eur > 0)
    .map((row) => ({
      competition_id: competitionId,
      position: row.position,
      amount_eur: row.amount_eur,
    }));

  const { error: deleteError } = await supabase
    .from("penalties_config")
    .delete()
    .eq("competition_id", competitionId);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  if (cleanRows.length > 0) {
    const { error: insertError } = await supabase
      .from("penalties_config")
      .insert(cleanRows);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    ok: true,
    saved: cleanRows.length,
  });
}