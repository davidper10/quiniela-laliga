import { getActiveCompetition } from "@/lib/activeCompetition";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import InviteSection from "./InviteSelection";
import RebuildScoresButton from "./RebuildScoresButton";
import PenaltiesConfig from "./PenaltiesConfig";
import Button from "@/components/ui/Button";
import DevToolsCard from "@/components/settings/DevToolsCard";

async function generateDemo() {

    const res = await fetch("/api/dev/seed",{
        method:"POST"
    });

    if(res.ok){

        alert("Datos demo generados");

    }else{

        alert("Ha ocurrido un error");

    }

}

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

  const { data: currentMatchday } = await supabase
    .from("matchdays")
    .select("id, number")
    .eq("competition_id", competitionId)
    .order("number", { ascending: false })
    .limit(1)
    .single();

  const { data: penaltiesConfig } = await supabase
    .from("penalties_config")
    .select("id, position, amount_eur")
    .eq("competition_id", competitionId)
    .order("position", { ascending: true });

  if (error) {
    return <main>Error: {error.message}</main>;
  }

  const normalizedMembers = members?.map((member) => ({
    ...member,
    profiles: Array.isArray(member.profiles) ? member.profiles[0] : member.profiles,
  })) ?? [];

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
            <p className="text-sm font-bold uppercase tracking-widest text-red-500">
                Jornada
            </p>

            <h2 className="mt-2 text-2xl font-black">
                Recalcular puntuaciones
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
                Calcula puntos y genera multas según la configuración actual.
            </p>

            {currentMatchday && (
                <div className="mt-5">
                <RebuildScoresButton
                    competitionId={competitionId}
                    matchdayId={currentMatchday.id}
                />
                </div>
            )}
        </Card>

        <PenaltiesConfig
            competitionId={competitionId}
            initialPenalties={penaltiesConfig ?? []}
        />

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
            {normalizedMembers.map((member) => (
              <div
                key={member.profiles?.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black p-4"
              >
                <div>
                  <p className="font-black">
                    {member.profiles?.username ?? "Usuario sin nombre"}
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

        <DevToolsCard />

      </div>
    </main>
  );
}
