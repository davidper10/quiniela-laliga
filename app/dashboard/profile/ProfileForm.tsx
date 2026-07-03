"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ProfileForm({
  email,
  initialUsername,
  initialDisplayName,
  initialAvatarUrl,
}: {
  email: string;
  initialUsername: string;
  initialDisplayName: string;
  initialAvatarUrl: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [username, setUsername] = useState(initialUsername);
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [password, setPassword] = useState("");

  async function saveProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        display_name: displayName,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Perfil actualizado");
    router.refresh();
  }

  async function changePassword() {
    if (!password) return;

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setPassword("");
    alert("Contraseña actualizada");
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="grid gap-6">
      <Card>
        <h2 className="text-2xl font-black">Datos de usuario</h2>

        <div className="mt-5 space-y-4">
          <Input value={email} disabled />

          <Input
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            placeholder="Nombre visible"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <Input
            placeholder="URL del avatar"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />

          <Button onClick={saveProfile}>Guardar perfil</Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-black">Seguridad</h2>

        <div className="mt-5 space-y-4">
          <Input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button variant="secondary" onClick={changePassword}>
            Cambiar contraseña
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-black text-red-500">Sesión</h2>

        <Button className="mt-5" variant="danger" onClick={signOut}>
          Cerrar sesión
        </Button>
      </Card>
    </div>
  );
}