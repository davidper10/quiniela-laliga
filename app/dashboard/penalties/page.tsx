import { getActiveCompetition } from "@/lib/activeCompetition";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import MarkPaidButton from "./MarkPaidButton";

export default async function PenaltiesPage() {
  const { supabase, competitionId } = await getActiveCompetition();

  const { data: penalties, error } = await supabase
    .from("penalties")
    .select(`
      id,
      amount_eur,
      status,
      reason,
      created_at,
      paid_at,
      profiles (
        username
      ),
      matchdays (
        number
      )
    `)
    .eq("competition_id", competitionId)
    .order("created_at", { ascending: false });

  if (error) {
    return <main>Error: {error.message}</main>;
  }

  const pending = penalties?.filter((p) => p.status === "pending") ?? [];
  const paid = penalties?.filter((p) => p.status === "paid") ?? [];

  const pendingTotal = pending.reduce(
    (sum, p) => sum + Number(p.amount_eur),
    0
  );

  const potTotal = paid.reduce(
    (sum, p) => sum + Number(p.amount_eur),
    0
  );

  return (
    <main>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-widest text-red-500">
          Caja
        </p>

        <h1 className="text-4xl font-black">Multas</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Control de multas pendientes y bote acumulado.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <Card>
          <p className="text-[11px] font-bold uppercase text-zinc-500">
            Bote acumulado
          </p>
          <p className="mt-2 text-3xl font-black text-white md:text-4xl">
            {potTotal.toFixed(2)}€
          </p>
        </Card>

        <Card>
          <p className="text-[11px] font-bold uppercase text-zinc-500">
            Pendiente
          </p>
          <p className="mt-2 text-3xl font-black text-red-500 md:text-4xl">
            {pendingTotal.toFixed(2)}€
          </p>
        </Card>
      </div>

      <Card>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-red-500">
              Pendientes
            </p>
          </div>

          <Badge>{pending.length} pendientes</Badge>
        </div>

        <div className="grid gap-3">
          {pending.length === 0 ? (
            <p className="text-zinc-400">No hay multas pendientes.</p>
          ) : (
            pending.map((penalty) => {
              const profile = Array.isArray(penalty.profiles)
                ? penalty.profiles[0]
                : penalty.profiles;
              const matchday = Array.isArray(penalty.matchdays)
                ? penalty.matchdays[0]
                : penalty.matchdays;

              return (
                <div
                  key={penalty.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black p-4"
                >
                  <div>
                    <p className="font-black">
                      {profile?.username ?? "Usuario"}
                    </p>

                    <p className="text-sm text-zinc-500">
                      Jornada {matchday?.number ?? "-"} ·{" "}
                      {penalty.reason}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-black text-red-500">
                      {Number(penalty.amount_eur).toFixed(2)}€
                    </p>
                    <Badge variant="warning">Pendiente</Badge>
                  </div>

                  <div className="mt-3">
                      <MarkPaidButton penaltyId={penalty.id} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      <Card className="mt-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-red-500">
              Historial
            </p>
          </div>

          <Badge variant="success">{paid.length} cobradas</Badge>
        </div>

        <div className="grid gap-3">
          {paid.length === 0 ? (
            <p className="text-zinc-400">Todavía no hay multas cobradas.</p>
          ) : (
            paid.map((penalty) => {
              const profile = Array.isArray(penalty.profiles)
                ? penalty.profiles[0]
                : penalty.profiles;
              const matchday = Array.isArray(penalty.matchdays)
                ? penalty.matchdays[0]
                : penalty.matchdays;

              return (
                <div
                  key={penalty.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black p-4"
                >
                  <div>
                    <p className="font-black">
                      {profile?.username ?? "Usuario"}
                    </p>

                    <p className="text-sm text-zinc-500">
                      Jornada {matchday?.number ?? "-"} ·{" "}
                      {penalty.paid_at
                        ? new Date(penalty.paid_at).toLocaleDateString("es-ES")
                        : "Pagada"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-black text-emerald-400">
                    {Number(penalty.amount_eur).toFixed(2)}€
                  </p>
                  <Badge variant="success">Cobrada</Badge>
                </div>
              </div>
              );
            })
          )}
        </div>
      </Card>
    </main>
  );
}