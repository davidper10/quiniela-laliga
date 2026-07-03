"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function JoinCompetitionForm() {
  const [code, setCode] = useState("");

  async function joinCompetition() {
    alert("Lo conectamos en el siguiente paso");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <h2 className="text-2xl font-black">Unirme con código</h2>

      <div className="mt-4 space-y-3">
        <Input
          placeholder="Código de invitación"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />

        <Button variant="secondary" onClick={joinCompetition}>
          Unirme
        </Button>
      </div>
    </div>
  );
}