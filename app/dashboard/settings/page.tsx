import { getActiveCompetition } from "@/lib/activeCompetition";
import InviteSection from "./InviteSelection";

export default async function SettingsPage() {
  const { supabase, competitionId, competition } =
    await getActiveCompetition();

  const { data: members, error } = await supabase
    .from("competition_members")
    .select(`
      role,
      profiles (
        id,
        username
      )
    `)
    .eq("competition_id", competitionId);

  if (error) {
    return <main className="p-6">Error: {error.message}</main>;
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Configuración</h1>

      <section className="mb-8 rounded border p-4">
        <h2 className="mb-2 text-xl font-semibold">Competición</h2>
        <p>{competition.name}</p>
        <p className="text-sm text-gray-600">Temporada {competition.season}</p>
      </section>

      <section className="rounded border p-4">
        <h2 className="mb-4 text-xl font-semibold">Miembros</h2>

        <div className="space-y-2">
          {members?.map((member) => (
            <div
              key={member.profiles.id}
              className="flex justify-between rounded bg-gray-50 p-3"
            >
              <span>
                {member.role === "admin" ? "👑 " : ""}
                {member.profiles.username ?? "Usuario sin nombre"}
              </span>

              <span className="text-sm text-gray-500">{member.role}</span>
            </div>
          ))}
        </div>
      </section>
      <InviteSection />
    </main>
  );
}