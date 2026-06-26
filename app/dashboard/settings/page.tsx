"use client";

export default function SettingsPage() {

  async function rebuild() {

    const competitionId = "d77d8175-ff40-4f54-b5a6-95779855a132";

    const response = await fetch("/api/scores/rebuild",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        competitionId
      })
    });

    const result = await response.json();

    console.log(result);

    alert(JSON.stringify(result));
  }


  return (

    <main className="p-6">

      <button
        onClick={rebuild}
        className="bg-black text-white rounded px-4 py-2"
      >

        Recalcular puntuaciones

      </button>

    </main>

  )

}