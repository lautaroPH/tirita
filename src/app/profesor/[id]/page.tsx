import type { Metadata } from "next";
import { after } from "next/server";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { Stars } from "@/components/Icons";
import { SubjectList } from "@/components/Line";
import { TearStrip } from "@/components/TearStrip";
import { getApprovedTeacher, listApprovedReviews, subjectLabel } from "@/lib/queries";
import { MODALITY_LABEL, UUID_RE, firstName, formatPesos, socialLabel } from "@/lib/site";
import { track } from "@/lib/track";
import { authConfigured, currentStudent } from "@/lib/auth/server";
import { ReviewForm } from "./ReviewForm";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ materia?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!UUID_RE.test(id)) return {};
  const t = await getApprovedTeacher(id);
  return t ? { title: t.name, description: t.subjects.map(subjectLabel).join(", ") } : {};
}

export default async function TeacherPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { materia } = await searchParams;
  if (!UUID_RE.test(id)) notFound();

  const [t, reviews, student] = await Promise.all([
    getApprovedTeacher(id),
    listApprovedReviews(id),
    currentStudent(),
  ]);
  if (!t) notFound();

  after(() => track("profile_view", { teacherId: id }));

  const contactHref = `/contacto/${id}${materia ? `?materia=${encodeURIComponent(materia)}` : ""}`;

  return (
    <div className="space-y-6">
      {/* El aviso completo del profe, con las tiritas de WhatsApp al pie. */}
      <div><article className="paper p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <Avatar name={t.name} src={t.photo_url} size={88} />
          <div className="min-w-0">
            <h1 className="display text-[clamp(1.9rem,8vw,2.6rem)] [overflow-wrap:anywhere]">{t.name}</h1>
            {t.demo && (
              <p className="mt-1 inline-block rounded bg-g1 px-2 py-0.5 text-sm font-semibold text-g4">
                Perfil de ejemplo
              </p>
            )}
            <p className="mt-1 text-g4">
              {MODALITY_LABEL[t.modality]}
              {t.zone && ` · ${t.zone}`}
            </p>
            <p className="mt-0.5 text-sm text-g4">
              {t.rating != null ? (
                <>
                  <span className="text-ink">
                    <Stars rating={t.rating} />
                  </span>{" "}
                  {t.rating.toFixed(1).replace(".", ",")} · {t.review_count}{" "}
                  {t.review_count === 1 ? "reseña" : "reseñas"}
                </>
              ) : (
                "Sin reseñas todavía"
              )}
            </p>
            {t.social_url && (
              <p className="mt-1 text-sm">
                {t.demo ? (
                  // En los ejemplos el link no se abre: podría ser la cuenta de alguien real.
                  <span className="font-semibold text-g4">{socialLabel(t.social_url)} (ejemplo)</span>
                ) : (
                  <a
                    href={t.social_url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="font-semibold text-pen underline decoration-pen/40 hover:decoration-pen"
                  >
                    {socialLabel(t.social_url)}
                  </a>
                )}
              </p>
            )}
          </div>
        </div>

        <p className="mt-5 flex items-baseline gap-2">
          <span className="display text-3xl">
            {t.rate_per_hour != null ? formatPesos(t.rate_per_hour) : "A consultar"}
          </span>
          <span className="text-g4">{t.rate_per_hour != null ? "la hora" : "precio por clase"}</span>
        </p>

        <h2 className="sr-only">Materias</h2>
        <SubjectList subjects={t.subjects} className="mt-5 text-lg" />

        {t.bio && (
          <>
            <h2 className="display mt-5 text-xl">Sobre mí</h2>
            <p className="mt-1 max-w-[65ch] whitespace-pre-line leading-relaxed">{t.bio}</p>
          </>
        )}

      </article>
      <TearStrip name={firstName(t.name)} href={contactHref} label="Escribir por WhatsApp" /></div>
      <p className="-mt-2 text-sm font-medium text-g4">
        Te abre WhatsApp con un mensaje listo. Contactar es gratis y se arregla directo con el profe.
      </p>

      <section className="paper space-y-3 p-4 sm:p-6">
        <h2 className="display text-2xl">Reseñas</h2>
        {reviews.length === 0 ? (
          <p className="text-g4">Todavía no tiene reseñas. Si tomaste clase, contá cómo te fue.</p>
        ) : (
          <ul className="divide-y divide-g2">
            {reviews.map((r) => (
              <li key={r.id} className="py-3 first:pt-0">
                <p className="flex items-center gap-2 text-sm">
                  <Stars rating={r.rating} />
                  <span className="font-semibold">{r.author_name}</span>
                </p>
                {r.comment && <p className="mt-1.5 max-w-[65ch]">{r.comment}</p>}
              </li>
            ))}
          </ul>
        )}
        <ReviewForm teacherId={t.id} student={student} loginEnabled={authConfigured()} />
      </section>
    </div>
  );
}
