"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function DevToolsCard() {
  const [loading, setLoading] = useState(false);

  async function generateDemo() {
    setLoading(true);

    const response = await fetch("/api/dev/seed", {
      method: "POST",
    });

    setLoading(false);

    if (!response.ok) {
      const result = await response.json();
      alert(result.error ?? "Error generando datos demo");
      return;
    }

    alert("Datos demo generados");
  }

  return (
    <Card>
      <p className="text-sm font-bold uppercase tracking-widest text-red-500">
        Desarrollo
      </p>

      <h2 className="mt-2 text-2xl font-black">Datos demo</h2>

      <p className="mt-2 text-zinc-400">
        Genera automáticamente una competición de prueba.
      </p>

      <Button className="mt-6" disabled={loading} onClick={generateDemo}>
        {loading ? "Generando..." : "Generar datos demo"}
      </Button>
    </Card>
  );
}