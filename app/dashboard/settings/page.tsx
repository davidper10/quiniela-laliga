import { getActiveCompetition } from "@/lib/activeCompetition";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
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
    return <main>Error: {error.message}</main>;
  }

  return (
    <main>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-widest text-red-500">
          Administración
        </p>

        <h1 className="text-4xl font-black">Configuración</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Gestiona la competición, miembros e invitaciones.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <p className="text-sm font-bold uppercase tracking-widest text-red-500">
            Competición
          </p>

          <h2 className="mt-2 text-2xl font-black">{competition.name}</h2>

          <p className="mt-1 text-zinc-400">
            Temporada {competition.season}
          </p>
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-red-500">
                Miembros
              </p>
              <h2 className="mt-2 text-2xl font-black">
                Participantes
              </h2>
            </div>

            <Badge>{members?.length ?? 0} usuarios</Badge>
          </div>

          <div className="grid gap-3">
            {members?.map((member) => (
              <div
                key={member.profiles.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black p-4"
              >
                <div>
                  <p className="font-black">
                    {member.profiles.username ?? "Usuario sin nombre"}
                  </p>
                  <p className="text-sm text-zinc-500">
                    Participante activo
                  </p>
                </div>

                <Badge variant={member.role === "admin" ? "admin" : "default"}>
                  {member.role === "admin" ? "Admin" : "Member"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <InviteSection />
      </div>
    </main>
  );
}