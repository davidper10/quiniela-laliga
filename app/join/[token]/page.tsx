import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import JoinButton from "./JoinButton";

export default async function JoinPage(
    {
        params
    }:{
        params:Promise<{
            token:string
        }>
    }
) {

    const {token} = await params;

    const supabase = await createClient();

    const {
        data:{user}
    }
    =
    await supabase.auth.getUser();



    if(!user){

        redirect("/login");

    }



    const {data:invite}
    =
    await supabase

    .from("competition_invites")

    .select(`
        id,
        token,

        competitions(
            id,
            name,
            season
        )

    `)

    .eq("token",token)

    .single();



    if(!invite){

        return(

            <main className="p-6">

                Invitación inválida

            </main>

        )

    }

    const competition = Array.isArray(invite.competitions)
      ? invite.competitions[0]
      : invite.competitions;

    if (!competition) {
      return (
        <main className="p-6">
          Invitación inválida
        </main>
      );
    }

    return(

        <main className="max-w-xl mx-auto p-6">


            <h1
            className="text-3xl font-bold mb-4"
            >

                Unirse a competición


            </h1>


            <div
            className="border rounded p-4"
            >

                <h2>

                    {competition.name}

                </h2>



                <p>

                    Temporada

                    {" "}

                    {competition.season}

                </p>


                <JoinButton token={token}/>
            </div>

            



        </main>


    )

}