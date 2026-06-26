"use client";

import { useState } from "react";
import StatusMessage from "@/components/StatusMessage";

export default function InviteSection() {
  const [inviteUrl, setInviteUrl] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");

  async function createInvite() {
    console.log("Generando invitación...");

    const response = await fetch("/api/invites/create", {
        method: "POST",
    });

    console.log("Response status:", response.status);

    const result = await response.json();

    console.log("Result:", result);

    if (!response.ok) {
        setMessageType("error");
        setMessage(result.error ?? "Error creando invitación");
        return;
    }

    const url = `${window.location.origin}/join/${result.token}`;
    setInviteUrl(url);
    }
  async function copyInvite() {
    await navigator.clipboard.writeText(inviteUrl);
    setMessageType("success");
    setMessage("Enlace copiado");
  }

  return (
    <section className="mt-8 rounded border p-4">
      <h2 className="mb-4 text-xl font-semibold">Invitaciones</h2>
      {message && <StatusMessage type={messageType} message={message} />}

      <button
        onClick={createInvite}
        className="rounded bg-black px-4 py-2 text-white"
      >
        Generar enlace
      </button>

      {inviteUrl && (
        <div className="mt-4 space-y-3">
          <p className="break-all rounded bg-gray-50 p-3 text-sm">
            {inviteUrl}
          </p>

          <button onClick={copyInvite} className="rounded border px-4 py-2">
            Copiar enlace
          </button>
        </div>
      )}
    </section>
  );
}