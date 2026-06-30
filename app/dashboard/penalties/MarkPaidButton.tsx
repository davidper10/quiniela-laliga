"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

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
    <Button variant="secondary" onClick={markPaid}>
      ✓ Cobrada
    </Button>
  );
}