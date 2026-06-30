"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SelectCompetitionButton({
  competitionId,
}: {
  competitionId: string;
}) {
  const router = useRouter();

  async function selectCompetition() {
    const response = await fetch("/api/competition/select", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ competitionId }),
    });

    const result = await response.json();

    if (!response.ok) {
      toast.error(result.error ?? "Error seleccionando competición");
      return;
    }

    toast.success("Competición seleccionada");
    router.push("/dashboard/home");
  }

  return (
    <button
      onClick={selectCompetition}
      className="mt-4 rounded bg-black px-4 py-2 text-white"
    >
      Entrar
    </button>
  );
}