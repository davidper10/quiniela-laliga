"use client";

import { useRouter } from "next/navigation";

export default function MarkPaidButton({
  penaltyId,
}: {
  penaltyId: string;
}) {
  const router = useRouter();

  async function markPaid() {
    const response = await fetch("/api/penalties/mark-paid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ penaltyId }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error ?? "Error marcando pagada");
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={markPaid}
      className="rounded-lg border border-red-500 px-3 py-1 text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
    >
      ✓ Cobrada
    </button>
  );
}