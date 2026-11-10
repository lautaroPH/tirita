import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { db } from "./db";

/**
 * Límite simple contra spam guardado en Postgres: como máximo `max` acciones
 * por actor en los últimos `minutes`. Devuelve true si se permite (y la registra).
 */
export async function rateLimit(action: string, actor: string, max: number, minutes: number) {
  const rows = await db()`
    with recent as (
      select count(*)::int as n from rate_events
      where action = ${action} and actor = ${actor}
        and created_at > now() - make_interval(mins => ${minutes}::int)
    ), ins as (
      insert into rate_events (action, actor)
      select ${action}, ${actor} from recent where n < ${max}::int
      returning 1
    )
    select count(*)::int as allowed from ins`;
  // De paso, limpia eventos de más de 2 días (barato con el índice).
  if (Math.random() < 0.02) {
    await db()`delete from rate_events where created_at < now() - interval '2 days'`;
  }
  return rows[0]!.allowed === 1;
}

/** IP del visitante con hash (nunca guardamos la IP en claro). */
export async function ipActor() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return "ip:" + createHash("sha256").update(ip + (process.env.NEON_AUTH_COOKIE_SECRET ?? "")).digest("hex").slice(0, 32);
}
