import "server-only";
import { db } from "./db";

export type EventType = "home_view" | "search" | "profile_view" | "whatsapp_click";

/** Registra un evento de medición. Nunca rompe la página si falla. */
export async function track(
  type: EventType,
  opts: { teacherId?: string | null; subjectId?: number | null } = {},
) {
  try {
    await db()`
      insert into events (type, teacher_id, subject_id)
      values (${type}, ${opts.teacherId ?? null}::uuid, ${opts.subjectId ?? null}::int)`;
  } catch (err) {
    console.error("track failed", err);
  }
}
