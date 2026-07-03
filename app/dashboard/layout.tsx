import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";
import Badge from "@/components/ui/Badge";
import { getActiveCompetition } from "@/lib/activeCompetition";
import DashboardMenu from "@/components/layout/DashboardMenu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { competition, supabase, user } = await getActiveCompetition();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <header className="border-b border-red-950/60 bg-zinc-950 px-6 py-5">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center">
                  <Image
                    src="/brand/logo.png"
                    alt="GolScore LaLiga"
                    width={64}
                    height={64}
                    priority
                    className="object-contain"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-black tracking-tight">
                      GOLSCORE LALIGA
                    </h1>
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

            <div className="flex items-center gap-3">
              <Link
                href="/competitions"
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Cambiar Liga
              </Link>

              <Link
                href="/dashboard/profile"
                className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-red-600 text-sm font-black text-white"
              >
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.display_name ?? profile.username ?? "Perfil"}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (profile?.display_name?.[0] ??
                    profile?.username?.[0] ??
                    user.email?.[0] ??
                    "U").toUpperCase()
                )}
              </Link>

              <DashboardMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {children}
      </div>

      <BottomNav />
    </div>
  );
}