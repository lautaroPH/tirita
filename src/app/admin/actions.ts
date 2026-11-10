"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { emailSubjectAdded, emailTeacherApproved, emailTeacherHidden, emailTeacherRejected } from "@/lib/email";
import { UUID_RE } from "@/lib/site";

const statusSchema = z.object({
  id: z.string().regex(UUID_RE),
  status: z.enum(["approved", "hidden", "rejected"]),
});

export async function setTeacherStatus(form: FormData) {
  await requireAdmin();
  const { id, status } = statusSchema.parse({ id: form.get("id"), status: form.get("status") });
  const rows = await db()`
    with prev as (select status from teachers where id = ${id}::uuid)
    update teachers set status = ${status},
      approved_at = case when ${status} = 'approved' then coalesce(approved_at, now()) else approved_at end
    where id = ${id}::uuid
    returning id, name, email, (select status from prev) as prev_status`;
  revalidatePath("/admin");

  // Aviso por email solo si el estado cambió (se manda después de responder).
  const t = rows[0] as { id: string; name: string; email: string; prev_status: string } | undefined;
  if (!t || t.prev_status === status) return;
  after(() =>
    status === "approved"
      ? emailTeacherApproved(t)
      : status === "rejected"
        ? emailTeacherRejected(t)
        : emailTeacherHidden(t),
  );
}

export async function approveReview(form: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().parse(form.get("id"));
  await db()`update reviews set status = 'approved' where id = ${id}`;
  revalidatePath("/admin");
}

export async function deleteReview(form: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().parse(form.get("id"));
  await db()`delete from reviews where id = ${id}`;
  revalidatePath("/admin");
}

const subjectSchema = z.object({
  name: z.string().trim().min(2).max(80),
  area: z.string().trim().max(40),
  level: z.enum(["secundaria", "universidad"]),
});

/** Crea la materia si no existe (por slug) y devuelve su id. */
async function upsertSubject(s: z.infer<typeof subjectSchema>): Promise<number> {
  const slug = [s.name, s.area, s.level === "secundaria" ? "secundaria" : ""]
    .filter(Boolean)
    .join("-")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const rows = await db()`
    insert into subjects (slug, name, level, area, sort)
    values (${slug}, ${s.name}, ${s.level}, ${s.area || null},
            (select coalesce(max(sort), 0) + 1 from subjects where level = ${s.level}))
    on conflict (slug) do update set slug = excluded.slug
    returning id`;
  return rows[0]!.id as number;
}

function parseSubject(form: FormData) {
  return subjectSchema.parse({
    name: form.get("name"),
    area: form.get("area") ?? "",
    level: form.get("level"),
  });
}

export async function addSubject(form: FormData) {
  await requireAdmin();
  await upsertSubject(parseSubject(form));
  revalidatePath("/admin");
}

/** Aprueba una materia escrita por un profe: la suma a la lista y la vincula al profe. */
export async function approveSubjectRequest(form: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().parse(form.get("id"));
  const subject = parseSubject(form);
  const subjectId = await upsertSubject(subject);
  const rows = await db()`
    with req as (
      update subject_requests set status = 'approved'
      where id = ${id} and status = 'pending'
      returning teacher_id
    ), linked as (
      insert into teacher_subjects (teacher_id, subject_id)
      select teacher_id, ${subjectId}::int from req
      on conflict do nothing
    )
    select t.name, t.email, t.status from teachers t join req on req.teacher_id = t.id`;
  revalidatePath("/admin");

  // Solo avisamos a profes ya publicados (a los pendientes les llega el email de aprobación).
  const t = rows[0] as { name: string; email: string; status: string } | undefined;
  if (t?.status === "approved") after(() => emailSubjectAdded(t, subject.name));
}

export async function markRemovalDone(form: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().parse(form.get("id"));
  await db()`update removal_requests set status = 'done' where id = ${id}`;
  revalidatePath("/admin");
}

export async function rejectSubjectRequest(form: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().parse(form.get("id"));
  await db()`update subject_requests set status = 'rejected' where id = ${id}`;
  revalidatePath("/admin");
}
