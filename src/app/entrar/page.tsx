import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GoogleButton } from "@/components/GoogleButton";
import { authConfigured, currentUser } from "@/lib/auth/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Entrar", robots: { index: false } };

function safePath(p: string | undefined) {
  return p && p.startsWith("/") && !p.startsWith("//") ? p : "/mi-perfil";
}

type SearchParams = Promise<{ volver?: string; redirectTo?: string }>;

export default async function EntrarPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const returnTo = safePath(sp.volver ?? sp.redirectTo);
  if (await currentUser()) redirect(returnTo);

  return (
    <div className="paper mx-auto mt-6 max-w-md space-y-4 p-6">
      <h1 className="display text-3xl">Entrar</h1>
      <p className="text-g4">
        Usamos tu cuenta de Google para que cada perfil y cada reseña sea de una persona real. No publicamos tu
        email.
      </p>
      {authConfigured() ? (
        <GoogleButton returnTo={returnTo} />
      ) : (
        <p className="text-g4">El login todavía no está configurado.</p>
      )}
    </div>
  );
}
