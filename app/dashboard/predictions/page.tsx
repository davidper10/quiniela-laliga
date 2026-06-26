import PredictionsForm from "./PredictionsForm";
import { getActiveCompetition } from "@/lib/activeCompetition";

export default async function PredictionsPage() {
  const { supabase, competitionId, user } = await getActiveCompetition();

  const { data: matchday, error: matchdayError } = await supabase
    .from("matchdays")
    .select(`
      id,
      number,
      status,
      matches (
        id,
        home_team,
        away_team,
        kickoff_at
      )
    `)
    .eq("competition_id", competitionId)
    .order("number", { ascending: true })
    .limit(1)
    .single();

  if (matchdayError) {
    return <main className="p-6">Error: {matchdayError.message}</main>;
  }

  const matchIds = matchday.matches.map((match) => match.id);

  const { data: predictions } = await supabase
    .from("predictions")
    .select("match_id, predicted_home_goals, predicted_away_goals")
    .eq("competition_id", competitionId)
    .eq("user_id", user.id)
    .in("match_id", matchIds);

  const firstKickoffAt = matchday.matches
    .map((match) => new Date(match.kickoff_at))
    .sort((a, b) => a.getTime() - b.getTime())[0];

    const isClosed = new Date() >= firstKickoffAt;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-2 text-3xl font-bold">Tus pronósticos</h1>
      <p className="mb-6 text-gray-600">Jornada {matchday.number}</p>

      <PredictionsForm
        competitionId={competitionId}
        matchdayId={matchday.id}
        matches={matchday.matches}
        initialPredictions={predictions ?? []}
        isClosed={isClosed}
      />
    </main>
  );
}