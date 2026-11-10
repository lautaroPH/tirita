import type { SubjectTag } from "@/lib/queries";
import { lineFor, type Line } from "@/lib/site";

/** Marca de facultad: el código pintado con el resaltador de esa facultad. */
export function LinePlate({ line, size = "md" }: { line: Line; size?: "sm" | "md" }) {
  const box = { sm: "text-sm", md: "text-lg" }[size];
  return (
    <span
      className={`display highlight inline-block shrink-0 text-ink ${box}`}
      style={{ background: `var(--line-${line.key})` }}
      title={line.label}
    >
      {line.code}
    </span>
  );
}

/**
 * Evita que el resaltador se parta feo: los nombres cortos van en un solo renglón
 * y en los largos se pegan las dos últimas palabras ("Matemática A" nunca deja la
 * "A" sola abajo).
 */
export function unbreakable(name: string, maxOneLine = 24) {
  if (name.length <= maxOneLine) return { text: name, nowrap: true };
  const i = name.lastIndexOf(" ");
  return { text: i > 0 ? `${name.slice(0, i)} ${name.slice(i + 1)}` : name, nowrap: false };
}

function Mark({ s }: { s: SubjectTag }) {
  const line = lineFor(s.area, s.level);
  const { text, nowrap } = unbreakable(s.name);
  return (
    <span
      className={`highlight ${nowrap ? "whitespace-nowrap" : ""}`}
      style={{ background: `var(--line-${line.key})` }}
    >
      {text}
      <span className="sr-only"> ({line.label})</span>
    </span>
  );
}

/** La frase del aviso: "Doy clases de A, B y C", cada materia con su resaltador. */
export function SubjectList({ subjects, max, className = "" }: { subjects: SubjectTag[]; max?: number; className?: string }) {
  const shown = max ? subjects.slice(0, max) : subjects;
  const rest = subjects.length - shown.length;
  return (
    <p className={`font-medium leading-relaxed ${className}`}>
      Doy clases de{" "}
      {shown.map((s, i) => (
        <span key={`${s.name}-${s.area}`}>
          <Mark s={s} />
          {i < shown.length - 2 ? ", " : i === shown.length - 2 ? (rest > 0 ? ", " : " y ") : ""}
        </span>
      ))}
      {rest > 0 && ` y ${rest} más`}
    </p>
  );
}
