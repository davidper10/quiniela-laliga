import { createAdminClient } from "@/lib/supabase/admin";

export async function seedCompetition() {
  const supabase = createAdminClient();

  console.log("Generando competición demo...");

  const { data: demoCompetition } = await supabase
    .from("competitions")
    .select("id")
    .eq("name", "Liga Demo")
    .single();

    if (demoCompetition) {
    await supabase
        .from("competitions")
        .delete()
        .eq("id", demoCompetition.id);

    console.log("Liga Demo eliminada");
    }

  const { data: existingCompetition } = await supabase
    .from("competitions")
    .select("*")
    .eq("name", "Liga Demo")
    .single();

    let competition = existingCompetition;

    if (!competition) {
    const { data: createdCompetition, error } = await supabase
        .from("competitions")
        .insert({
        name: "Liga Demo",
        season: "2025/2026",
        admin_user_id: "fd69c716-c9b8-402a-a5d9-197d395ce6a5",
        })
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    competition = createdCompetition;

        const demoTeams = [
            { name: "Real Madrid", short_name: "RMA" },
            { name: "Barcelona", short_name: "BAR" },
            { name: "Athletic", short_name: "ATH" },
            { name: "Betis", short_name: "BET" },
            { name: "Sevilla", short_name: "SEV" },
            { name: "Valencia", short_name: "VAL" },
            { name: "Villarreal", short_name: "VIL" },
            { name: "Atlético", short_name: "ATM" },
        ];

        const { error: teamsError } = await supabase
            .from("teams")
            .upsert(demoTeams, {
                onConflict: "name",
        });

        if (teamsError) {
            throw new Error(teamsError.message);
        }

        const { data: teams, error: teamsSelectError } = await supabase
        .from("teams")
        .select("id, name, short_name");

        if (teamsSelectError) {
            throw new Error(teamsSelectError.message);
        }

        const teamByName = new Map(
            teams.map((team) => [team.name, team])
        );

        console.log("Equipos demo preparados:", demoTeams.length);

        const { error: matchdaysError } = await supabase
        .from("matchdays")
        .insert([
            {
            competition_id: competition.id,
            league_code: "DEMO",
            season: "2025/2026",
            number: 1,
            first_kickoff_at: "2025-08-20T20:00:00Z",
            last_kickoff_at: "2025-08-20T22:00:00Z",
            status: "finished",
            },
            {
            competition_id: competition.id,
            league_code: "DEMO",
            season: "2025/2026",
            number: 2,
            first_kickoff_at: "2025-08-27T20:00:00Z",
            last_kickoff_at: "2025-08-27T22:00:00Z",
            status: "open",
            },
        ]);

        if (matchdaysError) {
        throw new Error(matchdaysError.message);
        }

        const { data: matchdays, error: matchdaysSelectError } = await supabase
        .from("matchdays")
        .select("id, number")
        .eq("competition_id", competition.id)
        .order("number");

        if (matchdaysSelectError) {
        throw new Error(matchdaysSelectError.message);
        }

        const matchday1 = matchdays.find((m) => m.number === 1)!;
        const matchday2 = matchdays.find((m) => m.number === 2)!;

        console.log("Jornadas creadas");

        const demoMatches = [
            {
                matchday_id: matchday1.id,
                home_team: "Real Madrid",
                away_team: "Barcelona",
                home_team_id: teamByName.get("Real Madrid")!.id,
                away_team_id: teamByName.get("Barcelona")!.id,
                home_goals: 2,
                away_goals: 1,
                status: "finished",
                kickoff_at: "2025-08-20T20:00:00Z",
            },
            {
                matchday_id: matchday1.id,
                home_team: "Athletic",
                away_team: "Betis",
                home_team_id: teamByName.get("Athletic")!.id,
                away_team_id: teamByName.get("Betis")!.id,
                home_goals: 1,
                away_goals: 1,
                status: "finished",
                kickoff_at: "2025-08-20T22:00:00Z",
            },
            {
                matchday_id: matchday2.id,
                home_team: "Sevilla",
                away_team: "Valencia",
                home_team_id: teamByName.get("Sevilla")!.id,
                away_team_id: teamByName.get("Valencia")!.id,
                home_goals: null,
                away_goals: null,
                status: "scheduled",
                kickoff_at: "2025-08-27T20:00:00Z",
            },
            {
                matchday_id: matchday2.id,
                home_team: "Villarreal",
                away_team: "Atlético",
                home_team_id: teamByName.get("Villarreal")!.id,
                away_team_id: teamByName.get("Atlético")!.id,
                home_goals: null,
                away_goals: null,
                status: "scheduled",
                kickoff_at: "2025-08-27T22:00:00Z",
            },
            ];

            const { error: matchesError } = await supabase
            .from("matches")
            .insert(demoMatches);

            if (matchesError) {
            throw new Error(matchesError.message);
            }

            console.log("Partidos creados");

        const { data: authUsers, error: usersError } =
        await supabase.auth.admin.listUsers();

        if (usersError) {
        throw new Error(usersError.message);
        }

        const demoUsers = authUsers.users.slice(0, 4);

        if (demoUsers.length === 0) {
        throw new Error("No hay usuarios registrados para añadir a la liga demo");
        }

        const memberRows = demoUsers.map((user, index) => ({
        competition_id: competition.id,
        user_id: user.id,
        role: index === 0 ? "admin" : "member",
        }));

        const { error: membersError } = await supabase
        .from("competition_members")
        .insert(memberRows);

        if (membersError) {
        throw new Error(membersError.message);
        }

        await supabase
        .from("profiles")
        .update({
            active_competition_id: competition.id,
        })
        .in(
            "id",
            demoUsers.map((user) => user.id)
        );

        console.log("Miembros demo añadidos:", demoUsers.length);
    }

    console.log("Competición demo:", competition.id);

  console.log("Competición demo creada:", competition.id);
}