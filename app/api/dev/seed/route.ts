import { NextResponse } from "next/server";
import { seedCompetition } from "@/lib/seed/seedCompetition";

export async function POST() {
  try {
    await seedCompetition();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("SEED ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}