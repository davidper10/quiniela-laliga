"use client";

import { useState } from "react";
import Link from "next/link";

const items = [
  { href: "/dashboard/home", label: "Inicio" },
  { href: "/dashboard/results", label: "Resultados" },
  { href: "/dashboard/predictions", label: "Pronósticos" },
  { href: "/dashboard/comparison", label: "Comparador" },
  { href: "/dashboard/rankings", label: "Clasificación" },
  { href: "/dashboard/penalties", label: "Caja" },
  { href: "/dashboard/admin-results", label: "Actualizar resultados" },
  { href: "/competitions", label: "Cambiar de liga" },
  { href: "/dashboard/settings", label: "Configuración" },
  { href: "/dashboard/profile", label: "Mi perfil" },
];

export default function DashboardMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xl font-black text-white"
      >
        ☰
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          />

          <aside className="fixed right-0 top-0 z-50 flex h-screen w-80 max-w-[85vw] flex-col border-l border-white/10 bg-zinc-950 shadow-2xl">
            <div className="shrink-0 flex items-center justify-between border-b border-white/10 p-6">
              <h2 className="text-2xl font-black">Menú</h2>

              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/15 px-3 py-1 text-white"
              >
                ✕
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
              <nav className="grid gap-3 pb-6">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl border border-white/10 bg-black px-4 py-4 font-bold text-zinc-200 transition hover:border-red-500"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}