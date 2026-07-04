"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Banknote, ClipboardPen, Goal, Home, Trophy } from "lucide-react";

const items = [
  {
    href: "/dashboard/home",
    icon: Home,
    label: "Inicio",
  },
  {
    href: "/dashboard/results",
    icon: Goal,
    label: "Resultados",
  },
  {
    href: "/dashboard/predictions",
    icon: ClipboardPen,
    label: "Pronósticos",
  },
  {
    href: "/dashboard/rankings",
    icon: Trophy,
    label: "Clasif.",
  },
  {
    href: "/dashboard/penalties",
    icon: Banknote,
    label: "Caja",
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-zinc-950/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur md:hidden">
      <div className="mx-auto mb-2 grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-xs font-bold transition ${
                active
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/25"
                  : "text-zinc-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={20} strokeWidth={2.5} />

              {/*<span className="mt-1 truncate text-[11px] leading-none">
                {item.label}
              </span>*/}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}