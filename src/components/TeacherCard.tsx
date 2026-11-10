import Link from "next/link";
import type { TeacherSummary } from "@/lib/queries";
import { MODALITY_LABEL, firstName, formatPesos } from "@/lib/site";
import { Avatar } from "./Avatar";
import { Stars } from "./Icons";
import { SubjectList } from "./Line";
import { TearStrip } from "./TearStrip";

// Cada profe es un aviso: mismos datos en el mismo orden (nombre, precio,
// modalidad y zona, reseñas, materias). El aviso lleva al perfil; la tirita, a WhatsApp.
export function TeacherCard({ t, subjectSlug }: { t: TeacherSummary; subjectSlug?: string }) {
  const q = subjectSlug ? `?materia=${subjectSlug}` : "";
  return (
    <article className="flex flex-col">
      <Link
        href={`/profesor/${t.id}${q}`}
        className="paper block flex-1 p-4 transition-colors hover:bg-g1"
      >
        <div className={t.photo_url ? "grid grid-cols-[56px_1fr] gap-x-3" : ""}>
          <Avatar name={t.name} src={t.photo_url} size={56} />
          <div className="min-w-0">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="display min-w-0 text-[19px] [overflow-wrap:anywhere]">{t.name}</h3>
              <span className="display shrink-0 text-[19px]">
                {t.rate_per_hour != null ? formatPesos(t.rate_per_hour) : "A consultar"}
              </span>
            </div>
            <p className="text-sm text-g4">
              {MODALITY_LABEL[t.modality]}
              {t.zone && ` · ${t.zone}`}
            </p>
            <p className="mt-0.5 text-sm text-g4">
              {t.rating != null ? (
                <>
                  <span className="text-ink">
                    <Stars rating={t.rating} size={13} />
                  </span>{" "}
                  {t.rating.toFixed(1).replace(".", ",")} ({t.review_count})
                </>
              ) : (
                "Sin reseñas todavía"
              )}
            </p>
          </div>
        </div>
        <SubjectList subjects={t.subjects} max={3} className="mt-2.5 text-base" />
      </Link>
      <TearStrip name={firstName(t.name)} href={`/contacto/${t.id}${q}`} label="WhatsApp" />
    </article>
  );
}
