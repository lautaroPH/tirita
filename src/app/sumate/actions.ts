"use server";

import { after } from "next/server";
import { currentUser } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { emailAdminNewTeacher } from "@/lib/email";
import { linkPhoto, savePhoto } from "@/lib/photos";
import { rateLimit } from "@/lib/rate-limit";
import { parseTeacherForm, saveTeacherSubjects } from "@/lib/teacher-form";

export type SignupState = { ok: boolean; message: string } | null;

// Crear el perfil: exige cuenta de Google. El email del perfil es el de Google.
export async function registerTeacher(_prev: SignupState, form: FormData): Promise<SignupState> {
  const user = await currentUser();
  if (!user) return { ok: false, message: "Entrá con Google para publicar tu perfil." };

  const existing = await db()`select 1 from teachers where user_id = ${user.id}`;
  if (existing.length > 0) return { ok: false, message: "Ya tenés un perfil. Lo podés editar en Mi perfil." };

  if (!(await rateLimit("signup", user.id, 3, 24 * 60))) {
    return { ok: false, message: "Hiciste demasiados intentos hoy. Probá de nuevo mañana." };
  }

  const parsed = parseTeacherForm(form);
  if (!parsed.ok) return parsed;
  const d = parsed.data;

  const photo = await savePhoto(form.get("photo"));
  if (!photo.ok) return photo;

  const rows = await db()`
    insert into teachers (name, email, whatsapp, zone, modality, rate_per_hour, bio, photo_url, social_url, user_id)
    values (${d.name}, ${user.email}, ${d.whatsapp}, ${d.zone}, ${d.modality}, ${d.rate}, ${d.bio},
            ${photo.url}, ${d.socialUrl}, ${user.id})
    on conflict (user_id) where user_id is not null do nothing
    returning id`;
  if (rows.length === 0) return { ok: false, message: "Ya tenés un perfil. Lo podés editar en Mi perfil." };

  const teacherId = rows[0]!.id as string;
  await linkPhoto(photo.url, teacherId);
  await saveTeacherSubjects(teacherId, d.subjects, d.otherSubjects);
  after(() => emailAdminNewTeacher(d.name));

  return {
    ok: true,
    message: "¡Listo! Recibimos tu perfil. Lo revisamos y te avisamos cuando esté publicado. Podés editarlo en Mi perfil.",
  };
}
