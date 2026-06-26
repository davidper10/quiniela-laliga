import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SelectCompetitionButton from "./SelectCompetitionButton";

export default async function CompetitionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: memberships, error } = await supabase
  .from("competition_members")
  .select(`
    role,
    competition:competitions!competition_members_competition_id_fkey (
      id,
      name,
      season
    )
  `)
  .eq("user_id", user.id);

  if (error) {
    return <p className="p-6">Error cargando competiciones: {error.message}</p>;
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Tus competiciones</h1>

      {memberships?.length === 0 ? (
        <p>No perteneces a ninguna competición todavía.</p>
      ) : (
        <div className="space-y-3">
          {memberships?.map((membership) => (
            <div
                key={membership.competition.id}
                className="rounded border p-4"
            >
                <h2 className="text-xl font-semibold">
                    {membership.competition.name}
                </h2>

                <p className="text-sm text-gray-600">
                    Temporada {membership.competition.season}
                </p>

                <p className="text-sm">Rol: {membership.role}</p>

                <SelectCompetitionButton competitionId={membership.competition.id} />
            </div>
            ))}
        </div>
      )}
    </main>
  );
}

/*
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function CompetitionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: memberships, error } = await supabase
    .from("competition_members")
    .select(`
      role,
      competitions (
        id,
        name,
        season
      )
    `)
    .eq("user_id", user.id);

  if (error) {
    return <p className="p-6">Error cargando competiciones: {error.message}</p>;
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Tus competiciones</h1>

      {memberships?.length === 0 ? (
        <p>No perteneces a ninguna competición todavía.</p>
      ) : (
        <div className="space-y-3">
          {memberships?.map((membership) => {
            const competition = Array.isArray(membership.competitions)
              ? membership.competitions[0]
              : membership.competitions;

            if (!competition) {
              return null;
            }

            return (
              <div key={competition.id} className="rounded border p-4">
                <h2 className="text-xl font-semibold">
                  {competition.name}
                </h2>
                <p className="text-sm text-gray-600">
                  Temporada {competition.season}
                </p>
                <p className="text-sm">Rol: {membership.role}</p>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
  */