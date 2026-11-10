"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { ipActor, rateLimit } from "@/lib/rate-limit";

export type BajaState = { ok: boolean; message: string } | null;

const TYPES = {
  perfil: "Borrar mi perfil de profe",
  resena: "Borrar una reseña",
  corregir: "Corregir datos",
  otro: "Otro",
} as const;

const schema = z.object({
  type: z.enum(["perfil", "resena", "corregir", "otro"], { message: "Elegí qué necesitás" }),
  name: z.string().trim().min(2, "Poné tu nombre").max(80),
  contact: z.string().trim().min(5, "Poné un email o WhatsApp para responderte").max(120),
  message: z.string().trim().min(10, "Contanos un poco más (qué perfil o reseña, qué dato)").max(1500),
});

export async function sendRemovalRequest(_prev: BajaState, form: FormData): Promise<BajaState> {
  // Campo trampa: los bots lo completan, las personas no lo ven.
  if (String(form.get("website") ?? "").trim() !== "") {
    return { ok: true, message: "Recibimos tu pedido." };
  }
  if (!(await rateLimit("baja", await ipActor(), 3, 60))) {
    return { ok: false, message: "Mandaste varios pedidos seguidos. Probá de nuevo en una hora." };
  }
  const parsed = schema.safeParse({
    type: form.get("type"),
    name: form.get("name"),
    contact: form.get("contact"),
    message: form.get("message"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Revisá los datos" };
  const d = parsed.data;

  await db()`
    insert into removal_requests (name, contact, message)
    values (${d.name}, ${d.contact}, ${`[${TYPES[d.type]}] ${d.message}`})`;
  return {
    ok: true,
    message: "Recibimos tu pedido. Lo resolvemos y te respondemos dentro de los 10 días hábiles.",
  };
}
