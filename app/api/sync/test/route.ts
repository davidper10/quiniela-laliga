import { NextResponse } from "next/server";
import { apiFootballFetch } from "@/lib/apiFootball";

export async function GET() {
  const data = await apiFootballFetch("/fixtures", {
    league: 140,
    season: 2024,
    round: "Regular Season - 1",
});

  return NextResponse.json(data);
}