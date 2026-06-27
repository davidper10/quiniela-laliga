"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatusMessage from "@/components/StatusMessage";

export default function InviteSection() {
  const [inviteUrl, setInviteUrl] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error" | "info">("info");

  async function createInvite() {
    setMessage("");

    const response = await fetch("/api/invites/create", {
      method: "POST",
    });

    const result = await response.json();

    if (!response.ok) {
      setMessageType("error");
      setMessage(result.error ?? "Error creando invitación");
      return;
    }

    const url = `${window.location.origin}/join/${result.token}`;
    setInviteUrl(url);
    setMessageType("success");
    setMessage("Invitación generada correctamente");
  }

  async function copyInvite() {
    await navigator.clipboard.writeText(inviteUrl);
    setMessageType("success");
    setMessage("Enlace copiado");
  }

  return (
    <Card>
      <div className="mb-5">
        <p className="text-sm font-bold uppercase tracking-widest text-red-500">
          Invitaciones
        </p>

        <h2 className="mt-2 text-2xl font-black">Invitar amigos</h2>

        <p className="mt-1 text-sm text-zinc-400">
          Genera un enlace y compártelo por WhatsApp, Telegram o Discord.
        </p>
      </div>

      {message && (
        <div className="mb-4">
          <StatusMessage type={messageType} message={message} />
        </div>
      )}

      <Button onClick={createInvite}>Generar enlace</Button>

      {inviteUrl && (
        <div className="mt-5 space-y-3">
          <div className="break-all rounded-2xl border border-white/10 bg-black p-4 text-sm text-zinc-300">
            {inviteUrl}
          </div>

          <Button variant="secondary" onClick={copyInvite}>
            Copiar enlace
          </Button>
        </div>
      )}
    </Card>
  );
}