import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getActiveCompetition } from "@/lib/activeCompetition";

export default async function ResultsPage() {
  const {
    supabase,
    competitionId
  } = await getActiveCompetition();

  if (!competitionId) {
    return <main className="p-6">Falta competitionId.</main>;
  }

  const { data: matchdays, error } = await supabase
    .from("matchdays")
    .select(`
      id,
      number,
      status,
      first_kickoff_at,
      matches (
        id,
        home_team,
        away_team,
        kickoff_at,
        home_goals,
        away_goals,
        status
      )
    `)
    .eq("competition_id", competitionId)
    .order("number", { ascending: true });

  if (error) {
    return <main className="p-6">Error: {error.message}</main>;
  }

  const currentMatchday = matchdays?.[0];

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Resultados</h1>

      {!currentMatchday ? (
        <p>No hay jornadas todavía.</p>
      ) : (
        <>
          <h2 className="mb-2 text-xl font-semibold">
            Jornada {currentMatchday.number}
          </h2>

          <p className="mb-4 text-sm text-gray-600">
            Estado: {currentMatchday.status}
          </p>

          <div className="space-y-3">
            {currentMatchday.matches.map((match) => (
              <div key={match.id} className="rounded border p-4">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {match.home_team} - {match.away_team}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(match.kickoff_at).toLocaleString("es-ES")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      {match.home_goals ?? "-"} - {match.away_goals ?? "-"}
                    </p>
                    <p className="text-sm text-gray-600">{match.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}