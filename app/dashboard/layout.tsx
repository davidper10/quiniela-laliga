import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import Badge from "@/components/ui/Badge";
import { getActiveCompetition } from "@/lib/activeCompetition";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { competition } = await getActiveCompetition();

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <header className="border-b border-red-950/60 bg-zinc-950 px-6 py-5">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-700 text-2xl">
                  🏆
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-black tracking-tight">
                      LIGA PRO-PRONÓSTICOS
                    </h1>
                    <Badge variant="danger">Red Edition</Badge>
                  </div>

                  <p className="text-sm text-zinc-400">
                    Competición:{" "}
                    <span className="font-semibold text-white">
                      {competition.name}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/competitions"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Cambiar
            </Link>
          </div>

          <nav className="mt-6 hidden grid-cols-5 gap-3 md:grid">
            <Link className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-center font-bold text-zinc-300 hover:border-red-500" href="/dashboard/home">
              0. Inicio
            </Link>
            <Link className="rounded-2xl border border-red-600 bg-white/5 px-4 py-4 text-center font-bold" href="/dashboard/results">
              1. Resultados
            </Link>
            <Link className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-center font-bold text-zinc-300 hover:border-red-500" href="/dashboard/predictions">
              2. Pronósticos
            </Link>
            <Link className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-center font-bold text-zinc-300 hover:border-red-500" href="/dashboard/comparison">
              3. Comparador
            </Link>
            <Link className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-center font-bold text-zinc-300 hover:border-red-500" href="/dashboard/rankings">
              4. Posiciones
            </Link>
            <Link className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-center font-bold text-zinc-300 hover:border-red-500" href="/dashboard/penalties">
              5. Caja
            </Link>
            <Link className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-center font-bold text-zinc-300 hover:border-red-500" href="/dashboard/settings">
              6. Admin
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {children}
      </div>

      <BottomNav />
    </div>
  );
}