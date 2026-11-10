import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { Stars } from "@/components/Icons";
import { SignOutButton } from "@/components/SignOutButton";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { MODALITY_LABEL, formatPesos, socialLabel, type Modality } from "@/lib/site";
import {
  addSubject,
  approveReview,
  approveSubjectRequest,
  markRemovalDone,
  deleteReview,
  rejectSubjectRequest,
  setTeacherStatus,
} from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Administración", robots: { index: false } };

type AdminTeacher = {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  photo_url: string | null;
  bio: string;
  zone: string;
  social_url: string | null;
  modality: Modality;
  rate_per_hour: number | null;
  status: "pending" | "approved" | "hidden" | "rejected";
  paused: boolean;
  created_at: string;
  subjects: string[] | null;
  views_30d: number;
  clicks_7d: number;
  clicks_30d: number;
  clicks_total: number;
};

const STATUS_LABEL = { pending: "Pendiente", approved: "Publicado", hidden: "Oculto", rejected: "Rechazado" };

export default async function AdminPage() {
  await requireAdmin();
  const sql = db();

  const [totals, weekly, teachers, reviews, subjectRequests, removals] = await Promise.all([
    sql`
      select type, count(*)::int as n from events
      where created_at > now() - interval '7 days' group by type`,
    sql`
      select to_char(date_trunc('week', created_at), 'DD/MM') as week, count(*)::int as n
      from events where type = 'whatsapp_click' and created_at > now() - interval '8 weeks'
      group by date_trunc('week', created_at) order by date_trunc('week', created_at)`,
    sql`
      select t.id, t.name, t.email, t.whatsapp, t.photo_url, t.bio, t.zone, t.social_url, t.modality,
        t.rate_per_hour, t.status, t.paused, t.created_at,
        (select array_agg(case when s.area is null then s.name else s.name || ' – ' || s.area end order by s.sort)
           from teacher_subjects ts join subjects s on s.id = ts.subject_id where ts.teacher_id = t.id) as subjects,
        count(*) filter (where e.type = 'profile_view' and e.created_at > now() - interval '30 days')::int as views_30d,
        count(*) filter (where e.type = 'whatsapp_click' and e.created_at > now() - interval '7 days')::int as clicks_7d,
        count(*) filter (where e.type = 'whatsapp_click' and e.created_at > now() - interval '30 days')::int as clicks_30d,
        count(*) filter (where e.type = 'whatsapp_click')::int as clicks_total
      from teachers t left join events e on e.teacher_id = t.id
      group by t.id order by t.created_at desc`,
    sql`
      select r.id, r.author_name, r.rating, r.comment, r.user_id is not null as verified, t.name as teacher_name
      from reviews r join teachers t on t.id = r.teacher_id
      where r.status = 'pending' order by r.created_at`,
    sql`
      select sr.id, sr.name, t.name as teacher_name, t.status as teacher_status
      from subject_requests sr join teachers t on t.id = sr.teacher_id
      where sr.status = 'pending' order by sr.created_at`,
    sql`
      select id, name, contact, message, to_char(created_at, 'DD/MM HH24:MI') as at
      from removal_requests where status = 'pending' order by created_at`,
  ]);

  const count = (type: string) => totals.find((r) => r.type === type)?.n ?? 0;
  const all = teachers as AdminTeacher[];
  const pending = all.filter((t) => t.status === "pending");
  const others = all.filter((t) => t.status !== "pending" && t.status !== "rejected");
  const withClient = others.filter((t) => t.status === "approved" && t.clicks_total > 0).length;
  const approvedCount = others.filter((t) => t.status === "approved").length;

  return (
    <div className="paper space-y-10 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="display text-3xl">Administración</h1>
        <SignOutButton className="text-sm text-g4 hover:text-ink" />
      </div>

      <section className="space-y-3">
        <h2 className="display text-2xl">Últimos 7 días</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Contactos por WhatsApp" value={count("whatsapp_click")} strong />
          <Stat label="Búsquedas" value={count("search")} />
          <Stat label="Perfiles vistos" value={count("profile_view")} />
          <Stat label="Visitas al inicio" value={count("home_view")} />
        </div>
        <p className="text-sm text-g4">
          {approvedCount} profes publicados · {withClient} recibieron al menos un contacto (meta semana 8: la
          mitad o más). Meta de contactos por semana en semana 8: 20 o más.
        </p>
        {weekly.length > 0 && (
          <table className="w-full max-w-sm text-sm">
            <thead>
              <tr className="text-left text-g4">
                <th className="py-1 font-normal">Semana del</th>
                <th className="py-1 text-right font-normal">Contactos</th>
              </tr>
            </thead>
            <tbody>
              {weekly.map((w) => (
                <tr key={w.week} className="border-t border-g2">
                  <td className="py-1">{w.week}</td>
                  <td className="py-1 text-right font-medium">{w.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="display text-2xl">Profes para revisar ({pending.length})</h2>
        {pending.length === 0 && <p className="text-g4">No hay perfiles pendientes.</p>}
        {pending.map((t) => (
          <div key={t.id} className="space-y-3 rounded border border-g2 p-4">
            <div className="flex gap-3">
              <Avatar name={t.name} src={t.photo_url} size={56} />
              <div className="min-w-0 text-sm">
                <p className="text-base font-semibold">{t.name}</p>
                <p className="text-g4">
                  {t.email} · +{t.whatsapp}
                </p>
                <p className="text-g4">
                  {MODALITY_LABEL[t.modality]}
                  {t.zone && ` · ${t.zone}`}
                  {t.rate_per_hour != null && ` · ${formatPesos(t.rate_per_hour)}/h`}
                </p>
                {t.social_url ? (
                  <a
                    href={t.social_url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="font-semibold text-pen underline"
                  >
                    Revisar {socialLabel(t.social_url)}
                  </a>
                ) : (
                  <p className="text-g4">Sin Instagram ni LinkedIn</p>
                )}
              </div>
            </div>
            <p className="text-sm">{(t.subjects ?? []).join(", ") || "Sin materias"}</p>
            {t.bio && <p className="whitespace-pre-line text-sm text-g4">{t.bio}</p>}
            <div className="flex gap-2">
              <StatusButton id={t.id} status="approved" label="Aprobar y publicar" primary />
              <StatusButton id={t.id} status="rejected" label="Rechazar" />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="display text-2xl">Pedidos de baja o corrección ({removals.length})</h2>
        <p className="text-sm text-g4">
          Llegan desde /baja. La ley pide responder dentro de los 10 días hábiles. Hacé el cambio (ocultar o borrar
          la reseña, corregir datos), respondé por el contacto que dejaron y marcalo como resuelto.
        </p>
        {removals.length === 0 && <p className="text-g4">No hay pedidos.</p>}
        {removals.map((r) => (
          <div key={r.id} className="space-y-2 rounded border border-g2 p-3 text-sm">
            <p>
              <span className="font-semibold">{r.name}</span> · {r.contact} · <span className="text-g4">{r.at}</span>
            </p>
            <p className="whitespace-pre-line">{r.message}</p>
            <form action={markRemovalDone}>
              <input type="hidden" name="id" value={r.id} />
              <button className="btn-secondary py-1.5 text-sm">Marcar como resuelto</button>
            </form>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="display text-2xl">Materias pedidas ({subjectRequests.length})</h2>
        <p className="text-sm text-g4">
          Materias que escribieron los profes porque no estaban en la lista. Corregí el nombre si hace falta:
          al aprobarla se suma a la lista y queda vinculada al profe.
        </p>
        {subjectRequests.length === 0 && <p className="text-g4">No hay materias pedidas.</p>}
        {subjectRequests.map((r) => (
          <form key={r.id} className="space-y-2 rounded border border-g2 p-3">
            <input type="hidden" name="id" value={r.id} />
            <p className="text-sm text-g4">
              Pedida por <span className="font-semibold text-ink">{r.teacher_name}</span>
              {r.teacher_status === "pending" && " (perfil todavía sin aprobar)"}
            </p>
            <div className="grid gap-2 sm:grid-cols-[2fr_1fr_1fr]">
              <input name="name" defaultValue={r.name} required maxLength={80} className="field" aria-label="Nombre" />
              <input name="area" placeholder="Facultad (si es universidad)" maxLength={40} className="field" aria-label="Facultad" />
              <select name="level" defaultValue="universidad" className="field-select" aria-label="Nivel">
                <option value="universidad">Universidad</option>
                <option value="secundaria">Secundaria</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button formAction={approveSubjectRequest} className="btn-primary py-1.5 text-sm">
                Aprobar y sumar
              </button>
              <button formAction={rejectSubjectRequest} formNoValidate className="btn-secondary py-1.5 text-sm">
                Rechazar
              </button>
            </div>
          </form>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="display text-2xl">Profes ({others.length})</h2>
        <p className="text-sm text-g4">
          Ocultá a quien no responde: un perfil que no contesta no se muestra.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left text-g4">
                <th className="py-2 font-normal">Profe</th>
                <th className="py-2 font-normal">Estado</th>
                <th className="py-2 text-right font-normal">Vistas 30d</th>
                <th className="py-2 text-right font-normal">Contactos 7d</th>
                <th className="py-2 text-right font-normal">30d</th>
                <th className="py-2 text-right font-normal">Total</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {others.map((t) => (
                <tr key={t.id} className="border-t border-g2">
                  <td className="py-2">
                    {t.status === "approved" ? (
                      <Link href={`/profesor/${t.id}`} className="font-medium underline decoration-g3 hover:decoration-ink">
                        {t.name}
                      </Link>
                    ) : (
                      t.name
                    )}
                  </td>
                  <td className="py-2">{STATUS_LABEL[t.status]}{t.paused && " (pausado por el profe)"}</td>
                  <td className="py-2 text-right">{t.views_30d}</td>
                  <td className="py-2 text-right">{t.clicks_7d}</td>
                  <td className="py-2 text-right">{t.clicks_30d}</td>
                  <td className="py-2 text-right font-medium">{t.clicks_total}</td>
                  <td className="py-2 text-right">
                    {t.status === "approved" ? (
                      <StatusButton id={t.id} status="hidden" label="Ocultar" small />
                    ) : (
                      <StatusButton id={t.id} status="approved" label="Volver a mostrar" small />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="display text-2xl">Reseñas para revisar ({reviews.length})</h2>
        {reviews.length === 0 && <p className="text-g4">No hay reseñas pendientes.</p>}
        {reviews.map((r) => (
          <div key={r.id} className="space-y-2 rounded border border-g2 p-4 text-sm">
            <p>
              <Stars rating={r.rating} /> · {r.author_name} sobre{" "}
              <span className="font-medium">{r.teacher_name}</span>
              {" · "}
              <span className={r.verified ? "font-semibold text-pen" : "text-g4"}>
                {r.verified ? "con cuenta de Google" : "sin cuenta (anterior al login)"}
              </span>
            </p>
            {r.comment && <p className="text-g4">{r.comment}</p>}
            <div className="flex gap-2">
              <form action={approveReview}>
                <input type="hidden" name="id" value={r.id} />
                <button className="btn-primary py-1.5 text-sm">Publicar</button>
              </form>
              <form action={deleteReview}>
                <input type="hidden" name="id" value={r.id} />
                <button className="btn-secondary py-1.5 text-sm">Borrar</button>
              </form>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="display text-2xl">Agregar materia</h2>
        <form action={addSubject} className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
          <input name="name" required placeholder="Nombre (ej. Física II)" className="field" />
          <input name="area" placeholder="Facultad (ej. Ingeniería)" className="field" />
          <select name="level" defaultValue="universidad" className="field-select">
            <option value="universidad">Universidad</option>
            <option value="secundaria">Secundaria</option>
          </select>
          <button className="btn-primary">Agregar</button>
        </form>
      </section>
    </div>
  );
}

function Stat({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={`rounded border p-4 ${strong ? "border-g3 bg-[var(--highlight)]" : "border-g2 bg-white"}`}>
      <p className="display text-3xl">{value}</p>
      <p className="text-sm text-g4">{label}</p>
    </div>
  );
}

function StatusButton({
  id,
  status,
  label,
  primary,
  small,
}: {
  id: string;
  status: "approved" | "hidden" | "rejected";
  label: string;
  primary?: boolean;
  small?: boolean;
}) {
  return (
    <form action={setTeacherStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button className={`${primary ? "btn-primary" : "btn-secondary"} ${small ? "px-2.5 py-1 text-xs" : "py-1.5 text-sm"}`}>
        {label}
      </button>
    </form>
  );
}
