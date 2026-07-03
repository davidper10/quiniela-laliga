"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function normalizeCode(value: string) {
  const trimmed = value.trim();

  if (trimmed.includes("/join/")) {
    return trimmed.split("/join/").pop()?.trim().toUpperCase() ?? "";
  }

  return trimmed.toUpperCase();
}

export default function JoinCompetitionForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function joinCompetition() {
    setLoading(true);

    console.log("CODE SENT:", code);
    
    const response = await fetch("/api/competitions/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      alert(result.error ?? "Código inválido");
      return;
    }

    router.push("/dashboard/home");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <h2 className="text-2xl font-black">Unirme con código</h2>

      <p className="mt-2 text-sm text-zinc-400">
        Introduce el código que te ha pasado el administrador.
      </p>

      <div className="mt-4 space-y-3">
        <Input
          placeholder="Código de invitación"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <Button
          variant="secondary"
          onClick={joinCompetition}
          disabled={loading || !code}
          className="w-full"
        >
          {loading ? "Uniendo..." : "Unirme"}
        </Button>
      </div>
    </div>
  );
}