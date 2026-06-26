import { createClient } from "@/lib/supabase/server";

export default async function RankingsPage() {

    const supabase = await createClient();

    const {
        data: rankings,
        error
    } = await supabase
        .from("scores")
        .select(`
            points,
            user_id,
            profiles(
                username
            )
        `);

    if(error){
        return <main className="p-6">{error.message}</main>
    }


    const totals = new Map();

    rankings?.forEach((r:any)=>{

        const username =
            r.profiles?.username ??
            "Usuario";

        totals.set(
            username,
            (totals.get(username) ?? 0) + r.points
        );

    });


    const ranking = Array
        .from(totals.entries())
        .sort((a,b)=>b[1]-a[1]);


    return(

        <main className="max-w-2xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6">
                Clasificación
            </h1>


            <div className="space-y-3">

                {ranking.map(([name,points],index)=>(

                    <div
                        key={name}
                        className="border rounded p-4 flex justify-between"
                    >

                        <span>

                            {index+1}. {name}

                        </span>


                        <strong>

                            {points} pts

                        </strong>


                    </div>

                ))}

            </div>


        </main>

    )

}