"use client";

import { startTransition, useActionState } from "react";
import { FormError } from "@/components/Icons";
import { LinePlate } from "@/components/Line";
import { lineFor, type Level, type Line, type Modality } from "@/lib/site";

export type SubjectOption = { id: number; name: string; area: string | null; level: Level };
export type FormState = { ok: boolean; message: string } | null;
export type TeacherDefaults = {
  name: string;
  whatsapp: string;
  zone: string;
  modality: Modality;
  rate: number | null;
  bio: string;
  social: string;
  subjects: number[];
};

function byLine(subjects: SubjectOption[]) {
  const groups = new Map<string, { line: Line; items: SubjectOption[] }>();
  for (const s of subjects) {
    const line = lineFor(s.area, s.level);
    const g = groups.get(line.label) ?? { line, items: [] };
    g.items.push(s);
    groups.set(line.label, g);
  }
  return [...groups.values()];
}

/** Formulario del perfil del profe: lo usan "Sumate" (crear) y "Mi perfil" (editar). */
export function TeacherForm({
  subjects,
  action: serverAction,
  email,
  defaults,
  submitLabel,
  keepSuccess = false,
}: {
  subjects: SubjectOption[];
  action: (prev: FormState, form: FormData) => Promise<FormState>;
  email: string;
  defaults?: TeacherDefaults;
  submitLabel: string;
  /** En "Mi perfil" el formulario sigue visible después de guardar. */
  keepSuccess?: boolean;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(serverAction, null);

  if (state?.ok && !keepSuccess) {
    return (
      <p role="status" className="rounded border-[1.5px] border-g3 bg-[var(--highlight)] px-4 py-4 text-lg font-medium">
        {state.message}
      </p>
    );
  }

  const checked = new Set(defaults?.subjects ?? []);

  return (
    // onSubmit en vez de action={...}: React 19 vacía el formulario después de una
    // acción, y si hay un error el profe perdería todo lo que escribió.
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      className="paper space-y-5 p-4 sm:p-6"
    >
      <Field label="Nombre y apellido">
        <input name="name" required maxLength={80} defaultValue={defaults?.name} className="field" autoComplete="name" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" hint="Es el de tu cuenta de Google. No se publica.">
          <input value={email} readOnly className="field bg-g1 text-g4" aria-readonly />
        </Field>
        <Field label="WhatsApp" hint="Con código de área, ej. 221 555-1234">
          <input
            name="whatsapp"
            type="tel"
            required
            defaultValue={defaults?.whatsapp}
            className="field"
            autoComplete="tel"
          />
        </Field>
      </div>

      <fieldset className="space-y-4">
        <legend className="display mb-1 text-2xl">Materias que das</legend>
        <p className="text-sm text-g4">Abrí tu facultad (o secundaria) y marcá las materias.</p>
        {byLine(subjects).map(({ line, items }) => (
          <details
            key={line.label}
            open={items.some((s) => checked.has(s.id))}
            className="group rounded border border-g2 bg-white open:pb-3"
          >
            <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 font-semibold">
              <LinePlate line={line} size="sm" />
              {line.label}
              <span className="text-sm font-normal text-g4">({items.length})</span>
              <span aria-hidden className="ml-auto text-g4 transition-transform group-open:rotate-180">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </summary>
            <div className="grid gap-1.5 px-3 sm:grid-cols-2">
              {items.map((s) => (
                <label
                  key={s.id}
                  className="flex cursor-pointer items-center gap-2.5 rounded border border-g2 bg-white px-3 py-2.5 text-[15px] has-[:checked]:border-ink has-[:checked]:bg-g1"
                >
                  <input
                    type="checkbox"
                    name="subjects"
                    value={s.id}
                    defaultChecked={checked.has(s.id)}
                    className="size-4 accent-ink"
                  />
                  {s.name}
                </label>
              ))}
            </div>
          </details>
        ))}
        <Field
          label="¿No está tu materia? Escribila"
          hint="Una por renglón, con la facultad o el nivel. Ej.: Física II – Ingeniería, Historia (secundaria). La revisamos y la sumamos a la lista."
        >
          <textarea name="otherSubjects" rows={3} maxLength={700} className="field" />
        </Field>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Modalidad">
          <select name="modality" required defaultValue={defaults?.modality ?? ""} className="field-select">
            <option value="" disabled>
              Elegí
            </option>
            <option value="presencial">Presencial</option>
            <option value="online">Online</option>
            <option value="ambas">Las dos</option>
          </select>
        </Field>
        <Field label="Zona o barrio">
          <input name="zone" maxLength={60} defaultValue={defaults?.zone} placeholder="Centro, Tolosa…" className="field" />
        </Field>
        <Field label="Tarifa por hora ($)">
          <input
            name="rate"
            inputMode="numeric"
            defaultValue={defaults?.rate ?? undefined}
            placeholder="15000"
            className="field"
          />
        </Field>
      </div>

      <Field label="Sobre vos" hint="Qué estudiás o estudiaste, experiencia, cómo son tus clases.">
        <textarea name="bio" rows={4} maxLength={1000} defaultValue={defaults?.bio} className="field" />
      </Field>

      <Field
        label="Instagram o LinkedIn (opcional)"
        hint="Se muestra en tu perfil para que los alumnos vean tu carrera. Ej.: @tuusuario o el link de LinkedIn."
      >
        <input
          name="social"
          maxLength={200}
          defaultValue={defaults?.social}
          placeholder="@tuusuario"
          className="field"
          autoComplete="off"
        />
      </Field>

      <Field
        label={defaults ? "Cambiar foto (opcional)" : "Foto (opcional)"}
        hint="JPG, PNG o la foto del celular, hasta 6 MB. Una foto de cara genera más confianza."
      >
        <input
          name="photo"
          type="file"
          accept="image/*"
          className="field file:mr-3 file:rounded file:border-0 file:bg-ink file:px-3 file:py-1.5 file:font-semibold file:text-white"
        />
      </Field>

      <label className="flex items-start gap-2.5 rounded border border-g2 bg-white p-3 text-sm">
        <input
          type="checkbox"
          name="consent"
          required
          defaultChecked={!!defaults}
          className="mt-0.5 size-4 shrink-0 accent-ink"
        />
        <span>
          Autorizo a publicar mi nombre, foto, materias, tarifa, zona, descripción e Instagram o LinkedIn, y a que
          los alumnos me contacten por WhatsApp. Puedo editar o borrar mi perfil cuando quiera (Ley 25.326,{" "}
          <a href="/privacidad" className="text-pen underline">
            ver privacidad
          </a>
          ).
        </span>
      </label>

      {state && !state.ok && <FormError>{state.message}</FormError>}
      {state?.ok && keepSuccess && (
        <p role="status" className="rounded border-[1.5px] border-g3 bg-[var(--highlight)] px-4 py-3 font-medium">
          {state.message}
        </p>
      )}

      <button disabled={pending} className="btn-primary w-full sm:w-auto">
        {pending ? "Guardando…" : submitLabel}
      </button>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="font-semibold">{label}</span>
      {children}
      {hint && <span className="block text-sm text-g4">{hint}</span>}
    </label>
  );
}
