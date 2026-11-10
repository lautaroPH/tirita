import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GoogleButton } from "@/components/GoogleButton";
import { TeacherForm } from "@/components/TeacherForm";
import { authConfigured, currentUser } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { listSubjects } from "@/lib/queries";
import { registerTeacher } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sumarme como profe" };

export default async function SignupPage() {
  const user = await currentUser();

  if (user) {
    const existing = await db()`select 1 from teachers where user_id = ${user.id}`;
    if (existing.length > 0) redirect("/mi-perfil");
  }

  const intro = (
    <div>
      <h1 className="display text-[clamp(2rem,9vw,2.75rem)]">Publicá tu perfil gratis</h1>
      <p className="mt-2 max-w-[60ch] font-medium text-g4">
        Sin comisiones ni suscripciones. Los alumnos te escriben directo a tu WhatsApp. Revisamos cada perfil a mano
        antes de publicarlo, y después lo podés editar o borrar cuando quieras.
      </p>
    </div>
  );

  if (!user) {
    return (
      <div className="space-y-6">
        {intro}
        <div className="paper space-y-3 p-4 sm:p-6">
          <p className="font-semibold">Primero entrá con tu cuenta de Google.</p>
          <p className="text-sm text-g4">
            Así sabemos que el perfil es tuyo y lo podés editar o borrar después. No publicamos tu email.
          </p>
          {authConfigured() ? (
            <GoogleButton returnTo="/sumate" label="Entrar con Google y seguir" />
          ) : (
            <p className="text-g4">El login todavía no está configurado.</p>
          )}
        </div>
      </div>
    );
  }

  const subjects = await listSubjects();
  return (
    <div className="space-y-6">
      {intro}
      <TeacherForm
        subjects={subjects.map((s) => ({ id: s.id, name: s.name, area: s.area, level: s.level }))}
        action={registerTeacher}
        email={user.email}
        submitLabel="Enviar mi perfil"
      />
    </div>
  );
}
