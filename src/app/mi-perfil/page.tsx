import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import { TeacherForm } from "@/components/TeacherForm";
import { requireUser } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { listSubjects } from "@/lib/queries";
import type { Modality } from "@/lib/site";
import { DeleteProfile } from "./DeleteProfile";
import { togglePause, updateMyProfile } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mi perfil", robots: { index: false } };

type Mine = {
  id: string;
  name: string;
  whatsapp: string;
  zone: string;
  modality: Modality;
  rate_per_hour: number | null;
  bio: string;
  social_url: string | null;
  status: "pending" | "approved" | "hidden" | "rejected";
  paused: boolean;
  subject_ids: number[] | null;
  pending_requests: string[] | null;
};

const STATUS = {
  pending: { title: "En revisión", text: "Recibimos tu perfil. Lo revisamos a mano y te avisamos cuando esté publicado." },
  approved: { title: "Publicado", text: "Tu perfil aparece en las búsquedas y los alumnos te pueden escribir." },
  hidden: {
    title: "Oculto",
    text: "Ocultamos tu perfil, por ejemplo porque no respondía a los alumnos. Escribinos desde la página de baja y correcciones si querés reactivarlo.",
  },
  rejected: {
    title: "No aprobado",
    text: "No pudimos aprobar tu perfil. Revisá tus datos y escribinos desde la página de baja y correcciones.",
  },
};

export default async function MiPerfilPage() {
  const user = await requireUser("/mi-perfil");
  const rows = await db()`
    select t.id, t.name, t.whatsapp, t.zone, t.modality, t.rate_per_hour, t.bio, t.social_url, t.status, t.paused,
      (select array_agg(ts.subject_id) from teacher_subjects ts where ts.teacher_id = t.id) as subject_ids,
      (select array_agg(r.name order by r.created_at) from subject_requests r
        where r.teacher_id = t.id and r.status = 'pending') as pending_requests
    from teachers t where t.user_id = ${user.id}`;
  const me = rows[0] as Mine | undefined;
  if (!me) redirect("/sumate");

  const subjects = await listSubjects();
  const status = STATUS[me.status];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="display text-[clamp(2rem,9vw,2.75rem)]">Mi perfil</h1>
        <SignOutButton className="text-sm text-g4 underline hover:text-ink" label="Salir de mi cuenta" />
      </div>

      <section className="paper space-y-2 p-4 sm:p-6">
        <p className="display text-2xl">
          {me.paused && me.status === "approved" ? "Pausado" : status.title}
        </p>
        <p className="text-g4">
          {me.paused && me.status === "approved"
            ? "Tu perfil no aparece en las búsquedas hasta que lo reactives."
            : status.text}
        </p>
        {me.status === "approved" && !me.paused && (
          <Link href={`/profesor/${me.id}`} className="inline-block font-semibold text-pen underline">
            Ver mi perfil público
          </Link>
        )}
        {me.pending_requests && me.pending_requests.length > 0 && (
          <p className="text-sm text-g4">
            Materias esperando revisión: {me.pending_requests.join(", ")}.
          </p>
        )}
      </section>

      <TeacherForm
        subjects={subjects.map((s) => ({ id: s.id, name: s.name, area: s.area, level: s.level }))}
        action={updateMyProfile}
        email={user.email}
        defaults={{
          name: me.name,
          whatsapp: `+${me.whatsapp}`,
          zone: me.zone,
          modality: me.modality,
          rate: me.rate_per_hour,
          bio: me.bio,
          social: me.social_url ?? "",
          subjects: me.subject_ids ?? [],
        }}
        submitLabel="Guardar cambios"
        keepSuccess
      />

      <section className="paper space-y-4 p-4 sm:p-6">
        <h2 className="display text-2xl">Pausar o borrar</h2>
        <form action={togglePause} className="space-y-2">
          <p className="text-g4">
            {me.paused
              ? "Tu perfil está pausado. Reactivalo para volver a aparecer en las búsquedas."
              : "¿Sin lugar para alumnos nuevos? Pausá tu perfil: deja de aparecer en las búsquedas, sin perder nada."}
          </p>
          <button className="btn-secondary">{me.paused ? "Reactivar mi perfil" : "Pausar mi perfil"}</button>
        </form>
        <DeleteProfile />
      </section>
    </div>
  );
}
