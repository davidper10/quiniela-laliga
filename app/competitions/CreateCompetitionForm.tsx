"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function CreateCompetitionForm() {
  const [name, setName] = useState("");
  const [season, setSeason] = useState("2025/2026");

  async function createCompetition() {
    alert("Lo conectamos en el siguiente paso");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <h2 className="text-2xl font-black">Crear liga</h2>

      <div className="mt-4 space-y-3">
        <Input
          placeholder="Nombre de la liga"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Temporada"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
        />

        <Button onClick={createCompetition}>Crear liga</Button>
      </div>
    </div>
  );
}