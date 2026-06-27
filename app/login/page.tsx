"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast.error(error.message)
      return;
    }

    toast.success("Usuario creado. Revisa tu email si Supabase pide confirmación.");
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/competitions";
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="mb-6 text-3xl font-bold">Quiniela de amigos</h1>

      <input
        className="mb-3 rounded border p-3"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="mb-4 rounded border p-3"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={signIn}
        className="mb-3 rounded bg-black p-3 text-white"
      >
        Entrar
      </button>

      <button onClick={signUp} className="rounded border p-3">
        Crear cuenta
      </button>
    </main>
  );
}