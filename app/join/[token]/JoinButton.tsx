"use client";

import { useRouter } from "next/navigation";

export default function JoinButton({
    token
}:{
    token:string
}){

    const router = useRouter();

    async function joinCompetition(){

        const response = await fetch("/api/invites/join",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                token
            })

        });

        const result = await response.json();

        if(!response.ok){

            alert(result.error);

            return;
        }

        router.push("/dashboard/results");

    }


    return(

        <button

            onClick={joinCompetition}

            className="mt-6 bg-black text-white rounded px-4 py-2"

        >

            Unirme

        </button>

    )

}