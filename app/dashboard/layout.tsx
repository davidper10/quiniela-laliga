import Link from "next/link";
import { getActiveCompetition } from "@/lib/activeCompetition";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { competition } = await getActiveCompetition();

  return (
    <div>
      <header className="border-b px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Competición activa</p>
              <h1 className="text-xl font-bold">
                {competition?.name} · {competition?.season}
              </h1>
            </div>

            <Link
              href="/competitions"
              className="rounded border px-3 py-2 text-sm"
            >
              Cambiar competición
            </Link>
          </div>

          <nav className="flex flex-wrap gap-4 text-sm">
            <Link href="/dashboard/results">Resultados</Link>
            <Link href="/dashboard/predictions">Tus pronósticos</Link>
            <Link href="/dashboard/comparison">Comparador</Link>
            <Link href="/dashboard/rankings">Clasificación</Link>
            <Link href="/dashboard/settings">Configuración</Link>
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}