import { getActiveCompetition } from "@/lib/activeCompetition";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const { supabase, user } = await getActiveCompetition();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <main>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-widest text-red-500">
          Cuenta
        </p>

        <h1 className="text-4xl font-black">Mi perfil</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Gestiona tu usuario, avatar y seguridad.
        </p>
      </div>

      <ProfileForm
        email={user.email ?? ""}
        initialUsername={profile?.username ?? ""}
        initialDisplayName={profile?.display_name ?? ""}
        initialAvatarUrl={profile?.avatar_url ?? ""}
      />
    </main>
  );
}