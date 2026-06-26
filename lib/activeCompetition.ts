import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getActiveCompetition() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("active_competition_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.active_competition_id) {
    redirect("/competitions");
  }

  const { data: competition, error: competitionError } = await supabase
    .from("competitions")
    .select("id, name, season")
    .eq("id", profile.active_competition_id)
    .single();

  if (competitionError || !competition) {
    redirect("/competitions");
  }

  return {
    supabase,
    user,
    competitionId: profile.active_competition_id,
    competition,
  };
}