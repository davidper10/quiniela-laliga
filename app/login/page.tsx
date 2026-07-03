"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Cuenta creada. Revisa tu email si Supabase pide confirmación.");
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

  async function resetPassword() {
    if (!email) {
      alert("Introduce tu email primero.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Te hemos enviado un email para recuperar la contraseña.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-8 shadow-2xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/brand/logo.png"
            alt="GolScore LaLiga"
            width={96}
            height={96}
            priority
            className="mb-4 object-contain"
          />

          <h1 className="text-4xl font-black">
            GolScore <span className="text-red-500">LaLiga</span>
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Compite con tus amigos jornada a jornada.
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full" onClick={signIn}>
            Entrar
          </Button>

          <Button className="w-full" variant="secondary" onClick={signUp}>
            Crear cuenta
          </Button>

          <button
            onClick={resetPassword}
            className="w-full text-sm font-semibold text-zinc-400 hover:text-red-400"
          >
            He olvidado mi contraseña
          </button>
        </div>
      </div>
    </main>
  );
}