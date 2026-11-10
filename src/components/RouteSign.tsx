import type { Subject } from "@/lib/queries";
import { lineFor } from "@/lib/site";
import { unbreakable } from "./Line";

/** Encabezado de la cartelera: de qué materia son los avisos y cuántos hay. */
export function RouteSign({ subject, count }: { subject: Subject | null; count: number }) {
  const line = subject ? lineFor(subject.area, subject.level) : null;
  const countText = count === 1 ? "1 aviso" : `${count} avisos`;
  // En el título grande, solo los nombres muy cortos van sin cortar.
  const name = subject ? unbreakable(subject.name, 16) : null;
  return (
    <section aria-live="polite">
      <h2 className="display text-[clamp(1.6rem,6.8vw,2.4rem)] [overflow-wrap:break-word] [text-wrap:balance]">
        {subject && name ? (
          <>
            Clases de{" "}
            <span
              className={`highlight ${name.nowrap ? "whitespace-nowrap" : ""}`}
              style={{ background: `var(--line-${line!.key})` }}
            >
              {name.text}
            </span>
          </>
        ) : (
          "Todos los avisos"
        )}
      </h2>
      <p className="mt-1 font-medium text-g4">
        {line ? `${line.label} · ` : ""}
        {countText}
      </p>
    </section>
  );
}
