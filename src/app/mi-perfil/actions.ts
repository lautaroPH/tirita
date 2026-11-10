"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { deletePhoto, savePhoto } from "@/lib/photos";
import { rateLimit } from "@/lib/rate-limit";
import { parseTeacherForm, saveTeacherSubjects } from "@/lib/teacher-form";

export type ProfileState = { ok: boolean; message: string } | null;

async function myTeacher() {
  const user = await currentUser();
  if (!user) return null;
  const rows = await db()`select id, photo_url from teachers where user_id = ${user.id}`;
  return rows[0] ? { user, id: rows[0].id as string, photoUrl: rows[0].photo_url as string | null } : null;
}

/** Guardar cambios del perfil. Se aplican al momento; el admin puede ocultarlo si hace falta. */
export async function updateMyProfile(_prev: ProfileState, form: FormData): Promise<ProfileState> {
  const me = await myTeacher();
  if (!me) return { ok: false, message: "Tu sesión se cerró. Entrá de nuevo con Google." };
  if (!(await rateLimit("profile-edit", me.user.id, 20, 60))) {
    return { ok: false, message: "Guardaste muchas veces seguidas. Probá de nuevo en un rato." };
  }

  const parsed = parseTeacherForm(form);
  if (!parsed.ok) return parsed;
  const d = parsed.data;

  const photo = await savePhoto(form.get("photo"), me.id);
  if (!photo.ok) return photo;

  await db()`
    update teachers set
      name = ${d.name}, whatsapp = ${d.whatsapp}, zone = ${d.zone}, modality = ${d.modality},
      rate_per_hour = ${d.rate}, bio = ${d.bio}, social_url = ${d.socialUrl},
      photo_url = coalesce(${photo.url}, photo_url), updated_at = now()
    where id = ${me.id}::uuid`;
  if (photo.url) await deletePhoto(me.photoUrl);

  await saveTeacherSubjects(me.id, d.subjects, d.otherSubjects);
  revalidatePath("/mi-perfil");
  return {
    ok: true,
    message:
      d.otherSubjects.length > 0
        ? "Guardado. Las materias nuevas aparecen cuando las revisemos."
        : "Guardado. Los cambios ya se ven en tu perfil.",
  };
}

/** Pausar o reactivar el perfil (deja de aparecer en las búsquedas, sin borrarse). */
export async function togglePause() {
  const me = await myTeacher();
  if (!me) redirect("/entrar?volver=/mi-perfil");
  await db()`update teachers set paused = not paused, updated_at = now() where id = ${me.id}::uuid`;
  revalidatePath("/mi-perfil");
}

/** Borrar el perfil para siempre: datos, materias, reseñas y foto (derecho de supresión). */
export async function deleteMyProfile() {
  const me = await myTeacher();
  if (!me) redirect("/entrar?volver=/mi-perfil");
  await db()`delete from teachers where id = ${me.id}::uuid`;
  await deletePhoto(me.photoUrl);
  redirect("/?perfil=borrado");
}
