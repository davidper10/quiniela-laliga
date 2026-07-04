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
      <header className="border-b border-red-950/60 bg-zinc-950 px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/brand/logo.png"
              alt="GolScore LaLiga"
              width={44}
              height={44}
              priority
              className="shrink-0 object-contain"
            />

            <p className="truncate text-base font-black">
              {competition.name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/profile"
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-red-600 text-sm font-black text-white"
            >
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.display_name ?? profile.username ?? "Perfil"}
                  width={40}
                  height={40}
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
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {children}
      </div>

      <BottomNav />
    </div>
  );
}