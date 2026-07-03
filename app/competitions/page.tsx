import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import SelectCompetitionButton from "./SelectCompetitionButton";
import CreateCompetitionForm from "./CreateCompetitionForm";
import JoinCompetitionForm from "./JoinCompetitionForm";

export default async function CompetitionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: memberships, error } = await supabase
    .from("competition_members")
    .select(`
      role,
      competition:competitions!competition_members_competition_id_fkey (
        id,
        name,
        season
      )
    `)
    .eq("user_id", user.id);

  if (error) {
    return <main className="p-6 text-white">Error: {error.message}</main>;
  }

  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center gap-4">
          <Image
            src="/brand/logo.png"
            alt="GolScore LaLiga"
            width={72}
            height={72}
            priority
            className="object-contain"
          />

          <div>
            <h1 className="text-4xl font-black">
              Tus <span className="text-red-500">ligas</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Entra en una competición, crea una nueva o únete con código.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <section className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black">Competiciones</h2>

            <div className="mt-5 grid gap-4">
              {memberships?.length === 0 ? (
                <p className="text-zinc-400">
                  Todavía no perteneces a ninguna liga.
                </p>
              ) : (
                memberships?.map((membership) => {
                  const competition = Array.isArray(membership.competition)
                    ? membership.competition[0]
                    : membership.competition;

                  if (!competition) {
                    return null;
                  }

                  return (
                    <div
                      key={competition.id}
                      className="rounded-2xl border border-white/10 bg-black p-4"
                    >
                      <h3 className="text-xl font-black">
                        {competition.name}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        Temporada {competition.season}
                      </p>

                      <p className="mt-1 text-sm text-zinc-400">
                        Rol: {membership.role}
                      </p>

                      <SelectCompetitionButton
                        competitionId={competition.id}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="grid gap-6">
            <CreateCompetitionForm />
            <JoinCompetitionForm />
          </section>
        </div>
      </div>
    </main>
  );
}