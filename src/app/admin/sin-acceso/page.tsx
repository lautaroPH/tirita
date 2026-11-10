import type { Metadata } from "next";
import { SignOutButton } from "@/components/SignOutButton";
import { currentUser } from "@/lib/auth/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sin acceso", robots: { index: false } };

export default async function SinAcceso() {
  const user = await currentUser();
  return (
    <div className="paper mx-auto mt-6 max-w-md space-y-4 p-6">
      <h1 className="display text-3xl">Sin acceso al admin</h1>
      <p className="text-g4">
        {user ? `La cuenta ${user.email} no está habilitada como administradora.` : "No entraste con ninguna cuenta."}
      </p>
      <SignOutButton redirectTo="/entrar?volver=/admin" label="Entrar con otra cuenta" />
    </div>
  );
}
