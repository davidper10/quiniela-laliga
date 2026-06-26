import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req:Request){

    const supabase = await createClient();

    const {
        data:{user}
    } = await supabase.auth.getUser();

    if(!user){

        return NextResponse.json(
            {error:"No autenticado"},
            {status:401}
        )

    }


    const {token} = await req.json();



    const {data:invite}
    =
    await supabase

    .from("competition_invites")

    .select("*")

    .eq("token",token)

    .single();


    if(!invite){

        return NextResponse.json(

            {error:"Invitación inválida"},

            {status:404}

        )

    }



    await supabase

    .from("competition_members")

    .upsert({

        competition_id:invite.competition_id,

        user_id:user.id,

        role:"member"

    });



    await supabase

    .from("profiles")

    .update({

        active_competition_id:invite.competition_id

    })

    .eq("id",user.id);



    await supabase

    .from("competition_invites")

    .update({

        used_by:user.id,

        used_at:new Date().toISOString()

    })

    .eq("id",invite.id);



    return NextResponse.json({

        ok:true

    })


}