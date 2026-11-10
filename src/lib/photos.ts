import "server-only";
import sharp from "sharp";
import { db } from "./db";
import { UUID_RE } from "./site";

// Fotos de los profes, guardadas en la propia base (tabla `photos`).
// Cada foto se achica a 480×480 en WebP (~30–60 KB) y se sirve en /foto/<id>.
// Para pasar a otro servicio (R2, Vercel Blob…) alcanza con reescribir este archivo.

const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;
const SIZE = 480;

export type PhotoResult = { ok: true; url: string | null } | { ok: false; message: string };

/** Valida, achica y guarda la foto del formulario. Sin archivo devuelve url null. */
export async function savePhoto(photo: FormDataEntryValue | null, teacherId?: string): Promise<PhotoResult> {
  if (!(photo instanceof File) || photo.size === 0) return { ok: true, url: null };
  if (photo.size > MAX_UPLOAD_BYTES) return { ok: false, message: "La foto pesa más de 6 MB" };

  let data: Buffer;
  try {
    data = await sharp(Buffer.from(await photo.arrayBuffer()), { limitInputPixels: 40_000_000 })
      .rotate() // respeta la orientación de las fotos del celular
      .resize(SIZE, SIZE, { fit: "cover", position: "attention" })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    return { ok: false, message: "No pudimos leer la foto. Probá con un JPG o PNG." };
  }

  const rows = await db()`
    insert into photos (teacher_id, data) values (${teacherId ?? null}::uuid, ${data})
    returning id`;
  // De paso, borra fotos huérfanas (formularios que fallaron después de subir la foto).
  if (Math.random() < 0.05) {
    await db()`delete from photos where teacher_id is null and created_at < now() - interval '1 day'`;
  }
  return { ok: true, url: `/foto/${rows[0]!.id}` };
}

function photoId(url: string | null) {
  const id = url?.match(/^\/foto\/([0-9a-f-]{36})$/i)?.[1];
  return id && UUID_RE.test(id) ? id : null;
}

/** Vincula una foto recién subida con el profe (al crear el perfil). */
export async function linkPhoto(url: string | null, teacherId: string) {
  const id = photoId(url);
  if (id) await db()`update photos set teacher_id = ${teacherId}::uuid where id = ${id}::uuid`;
}

/** Borra una foto vieja; si falla, no rompe nada. */
export async function deletePhoto(url: string | null) {
  const id = photoId(url);
  if (!id) return;
  try {
    await db()`delete from photos where id = ${id}::uuid`;
  } catch (err) {
    console.error("deletePhoto failed", err);
  }
}
