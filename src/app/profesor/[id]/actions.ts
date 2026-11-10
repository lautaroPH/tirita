"use server";

import { z } from "zod";
import { currentStudent } from "@/lib/auth/server";
import { rateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/db";
import { UUID_RE } from "@/lib/site";

export type ReviewState = { ok: boolean; message: string } | null;

const schema = z.object({
  teacherId: z.string().regex(UUID_RE),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(800),
});

// Solo alumnos con sesión de Google; una reseña por alumno y profe; el admin la aprueba.
export async function submitReview(_prev: ReviewState, form: FormData): Promise<ReviewState> {
  const student = await currentStudent();
  if (!student) {
    return { ok: false, message: "Entrá con Google para dejar tu reseña." };
  }
  if (!(await rateLimit("review", student.id, 5, 60))) {
    return { ok: false, message: "Mandaste muchas reseñas seguidas. Probá de nuevo en un rato." };
  }

  const parsed = schema.safeParse({
    teacherId: form.get("teacherId"),
    rating: form.get("rating"),
    comment: form.get("comment") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Revisá los datos" };
  }
  const { teacherId, rating, comment } = parsed.data;
  // Se publica solo el primer nombre del alumno.
  const author = student.name.split(/\s+/)[0]!.slice(0, 60);

  const rows = await db()`
    insert into reviews (teacher_id, author_name, rating, comment, user_id)
    select id, ${author}, ${rating}, ${comment}, ${student.id} from teachers
    where id = ${teacherId}::uuid and status = 'approved' and not paused
    on conflict (teacher_id, user_id) where user_id is not null do nothing
    returning id`;
  if (rows.length === 0) {
    return { ok: false, message: "Ya dejaste una reseña para este profe." };
  }
  return { ok: true, message: "¡Gracias! Tu reseña se publica cuando la revisemos." };
}
