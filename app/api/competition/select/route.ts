import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {

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


    const body = await req.json();

    const competitionId = body.competitionId;


    const {error} = await supabase

        .from("profiles")

        .update({

            active_competition_id:competitionId

        })

        .eq("id",user.id);



    if(error){

        return NextResponse.json(

            {error:error.message},

            {status:500}

        )

    }



    return NextResponse.json({

        ok:true

    })


}