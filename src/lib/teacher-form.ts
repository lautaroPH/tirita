import "server-only";
import { z } from "zod";
import { db } from "./db";
import { normalizeSocial, normalizeWhatsapp } from "./site";

// Validación compartida entre "Sumate" (crear perfil) y "Mi perfil" (editarlo).

const schema = z
  .object({
    name: z.string().trim().min(3, "Poné tu nombre y apellido").max(80),
    whatsapp: z.string().trim().min(8, "Poné tu WhatsApp"),
    zone: z.string().trim().max(60),
    modality: z.enum(["presencial", "online", "ambas"], { message: "Elegí una modalidad" }),
    rate: z
      .string()
      .trim()
      .transform((v) => (v ? Number(v.replace(/\D/g, "")) : null))
      .refine((v) => v == null || (v > 0 && v < 1_000_000), "La tarifa no parece válida"),
    bio: z.string().trim().max(1000),
    subjects: z.array(z.coerce.number().int().positive()).max(15),
    // Materias que no están en la lista: una por renglón (o separadas por coma).
    otherSubjects: z
      .string()
      .transform((v) =>
        [...new Set(v.split(/[\n,;]+/).map((s) => s.trim().replace(/\s+/g, " ")).filter((s) => s.length >= 2))],
      )
      .refine((list) => list.length <= 8, "Escribí hasta 8 materias nuevas")
      .refine((list) => list.every((s) => s.length <= 80), "Alguna materia es demasiado larga"),
    social: z.string().trim().max(200),
    consent: z.literal("on", { message: "Necesitamos tu autorización para publicar el perfil" }),
  })
  .refine((d) => d.subjects.length + d.otherSubjects.length > 0, {
    message: "Elegí al menos una materia o escribí la tuya",
  });

export type TeacherInput = {
  name: string;
  whatsapp: string;
  zone: string;
  modality: "presencial" | "online" | "ambas";
  rate: number | null;
  bio: string;
  subjects: number[];
  otherSubjects: string[];
  socialUrl: string | null;
};

export function parseTeacherForm(form: FormData): { ok: true; data: TeacherInput } | { ok: false; message: string } {
  const parsed = schema.safeParse({
    name: form.get("name"),
    whatsapp: form.get("whatsapp"),
    zone: form.get("zone") ?? "",
    modality: form.get("modality"),
    rate: form.get("rate") ?? "",
    bio: form.get("bio") ?? "",
    subjects: form.getAll("subjects"),
    otherSubjects: form.get("otherSubjects") ?? "",
    social: form.get("social") ?? "",
    consent: form.get("consent"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Revisá los datos" };
  const d = parsed.data;

  const whatsapp = normalizeWhatsapp(d.whatsapp);
  if (!whatsapp) return { ok: false, message: "Poné el WhatsApp con código de área, por ejemplo 221 555-1234" };

  const socialUrl = d.social ? normalizeSocial(d.social) : null;
  if (d.social && !socialUrl) {
    return { ok: false, message: "Poné tu usuario de Instagram (ej. @tuusuario) o un link de Instagram o LinkedIn" };
  }

  return {
    ok: true,
    data: { ...d, whatsapp, socialUrl, otherSubjects: d.otherSubjects },
  };
}

/** Deja las materias del profe exactamente como las eligió y guarda los pedidos nuevos. */
export async function saveTeacherSubjects(teacherId: string, subjects: number[], otherSubjects: string[]) {
  await db()`
    delete from teacher_subjects
    where teacher_id = ${teacherId}::uuid and not (subject_id = any(${subjects}::int[]))`;
  if (subjects.length > 0) {
    await db()`
      insert into teacher_subjects (teacher_id, subject_id)
      select ${teacherId}::uuid, id from subjects where id = any(${subjects}::int[])
      on conflict do nothing`;
  }
  // Las materias escritas a mano quedan como pedido hasta que el admin las apruebe.
  if (otherSubjects.length > 0) {
    await db()`
      insert into subject_requests (teacher_id, name)
      select ${teacherId}::uuid, n from unnest(${otherSubjects}::text[]) as n
      where not exists (
        select 1 from subject_requests r
        where r.teacher_id = ${teacherId}::uuid and lower(r.name) = lower(n) and r.status = 'pending'
      )`;
  }
}
