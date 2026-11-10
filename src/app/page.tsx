import { after } from "next/server";
import Link from "next/link";
import { LinePlate } from "@/components/Line";
import { RouteSign } from "@/components/RouteSign";
import { TeacherCard } from "@/components/TeacherCard";
import { listSubjects, searchTeachers, type Subject } from "@/lib/queries";
import { lineFor, type Level, type Line } from "@/lib/site";
import { track } from "@/lib/track";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ materia?: string; nivel?: string; modalidad?: string }>;

/** Agrupa materias por facultad (línea), en el orden en que vienen. */
function byLine(subjects: Subject[]) {
  const groups = new Map<string, { line: Line; items: Subject[] }>();
  for (const s of subjects) {
    const line = lineFor(s.area, s.level);
    const g = groups.get(line.label) ?? { line, items: [] };
    g.items.push(s);
    groups.set(line.label, g);
  }
  return [...groups.values()];
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const subjects = await listSubjects();

  const subject = subjects.find((s) => s.slug === sp.materia) ?? null;
  const level: Level | null =
    sp.nivel === "secundaria" || sp.nivel === "universidad" ? sp.nivel : null;
  const modality = sp.modalidad === "presencial" || sp.modalidad === "online" ? sp.modalidad : null;
  const hasFilters = !!(subject || level || modality);

  const teachers = await searchTeachers({ subjectId: subject?.id ?? null, level, modality });

  after(() => track(hasFilters ? "search" : "home_view", { subjectId: subject?.id }));


  return (
    <div className="space-y-6">
      <section>
        <h1 className="display text-[clamp(2rem,9vw,2.9rem)]">Encontrá profe para tu materia</h1>
        <p className="mt-1.5 font-medium text-g4">
          Gratis de verdad, sin suscripciones. Le escribís directo por WhatsApp.
        </p>
      </section>

      <form className="paper grid gap-2.5 rounded-md p-3 sm:grid-cols-[1.6fr_1fr_1.2fr_auto]">
        <label className="sr-only" htmlFor="materia">Materia</label>
        <select id="materia" name="materia" defaultValue={subject?.slug ?? ""} className="field-select col-span-full sm:col-span-1">
          <option value="">Todas las materias</option>
          {byLine(subjects).map(({ line, items }) => (
            <optgroup key={line.label} label={line.key === "sec" ? "Secundaria" : `UNLP · ${line.label}`}>
              {items.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2.5 sm:contents">
          <label className="sr-only" htmlFor="nivel">Nivel</label>
          <select id="nivel" name="nivel" defaultValue={level ?? ""} className="field-select">
            <option value="">Nivel</option>
            <option value="secundaria">Secundaria</option>
            <option value="universidad">Universidad</option>
          </select>
          <label className="sr-only" htmlFor="modalidad">Modalidad</label>
          <select id="modalidad" name="modalidad" defaultValue={modality ?? ""} className="field-select">
            <option value="">Modalidad</option>
            <option value="presencial">Presencial</option>
            <option value="online">Online</option>
          </select>
        </div>
        <button className="btn-primary col-span-full sm:col-span-1">Buscar profe</button>
      </form>

      <RouteSign subject={subject} count={teachers.length} />

      {teachers.length === 0 ? (
        <div className="rounded border-2 border-dashed border-g3 px-4 py-6 text-center">
          {hasFilters ? (
            <>
              <p className="display text-xl">Todavía no hay avisos para esta búsqueda.</p>
              <p className="mt-1 text-sm text-g4">
                Probá con otra materia o modalidad.{" "}
                <Link href="/" className="font-semibold text-pen underline">
                  Ver todos los profes
                </Link>
              </p>
            </>
          ) : (
            <>
              <p className="display text-xl">Estamos armando la cartelera.</p>
              <p className="mt-1 text-sm text-g4">
                Muy pronto vas a encontrar acá a los primeros profes.{" "}
                <Link href="/sumate" className="font-semibold text-pen underline">
                  ¿Das clases? Publicá tu aviso gratis
                </Link>
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {teachers.map((t) => (
            <TeacherCard key={t.id} t={t} subjectSlug={subject?.slug} />
          ))}
        </div>
      )}

      {!subject && (
        <section className="paper space-y-4 p-4">
          <h2 className="display text-2xl">Materias por facultad</h2>
          {byLine(subjects).map(({ line, items }) => (
            <div key={line.label} className="grid grid-cols-[52px_1fr] items-start gap-3">
              <LinePlate line={line} />
              <div>
                <p className="text-sm font-semibold text-g4">{line.label}</p>
                <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  {items.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/?materia=${s.slug}`}
                        className="text-[15px] font-medium text-pen underline decoration-pen/40 decoration-1 hover:decoration-pen"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
