"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

type Penalty = {
  id?: string;
  position: number;
  amount_eur: number;
};

export default function PenaltiesConfig({
  competitionId,
  initialPenalties,
}: {
  competitionId: string;
  initialPenalties: Penalty[];
}) {
  const [rows, setRows] = useState(initialPenalties);

  function updateRow(
    index: number,
    field: keyof Penalty,
    value: number
  ) {
    const copy = [...rows];

    copy[index] = {
      ...copy[index],
      [field]: value,
    };

    setRows(copy);
  }

  function addRow() {
    setRows([
      ...rows,
      {
        position: rows.length + 1,
        amount_eur: 0,
      },
    ]);
  }

  function removeRow(index: number) {
    setRows(rows.filter((_, i) => i !== index));
  }

  async function save() {
    const response = await fetch("/api/penalties/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        competitionId,
        rows,
      }),
    });

    if (!response.ok) {
        const result = await response.json();
        alert(result.error ?? "Error guardando");
        return;
    }

    alert("Configuración guardada");
  }

  return (
    <Card>
      <div className="mb-5">
        <p className="text-sm font-bold uppercase tracking-widest text-red-500">
          Configuración de multas
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Posiciones sancionadas
        </h2>
      </div>

      <div className="space-y-3">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-[100px_1fr_auto] gap-3"
          >
            <Input
              type="number"
              value={row.position}
              onChange={(e) =>
                updateRow(
                  index,
                  "position",
                  Number(e.target.value)
                )
              }
            />

            <Input
              type="number"
              step="0.5"
              value={row.amount_eur}
              onChange={(e) =>
                updateRow(
                  index,
                  "amount_eur",
                  Number(e.target.value)
                )
              }
            />

            <Button
              variant="danger"
              onClick={() => removeRow(index)}
            >
              🗑
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-5 flex gap-3">
        <Button variant="secondary" onClick={addRow}>
          + Añadir multa
        </Button>

        <Button onClick={save}>
          Guardar configuración
        </Button>
      </div>
    </Card>
  );
}