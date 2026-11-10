import "server-only";
import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Row = Record<string, any>;

let pool: Pool | null = null;

function getPool() {
  if (!pool) {
    const url = process.env.DATABASE_URL; // pooled (-pooler) para el tráfico de la app
    if (!url) throw new Error("Falta DATABASE_URL (ver .env.example)");
    pool = new Pool({ connectionString: strictSsl(url), max: 10, idleTimeoutMillis: 5000 });
    // En Vercel Fluid compute cierra las conexiones ociosas antes de suspender la función.
    attachDatabasePool(pool);
  }
  return pool;
}

/** Neon da `sslmode=require`; pg pide `verify-full` explícito para verificar el certificado. */
export function strictSsl(url: string) {
  return url.replace(/sslmode=(require|prefer|verify-ca)\b/, "sslmode=verify-full");
}

async function sql(strings: TemplateStringsArray, ...values: unknown[]): Promise<Row[]> {
  const text = strings.reduce((acc, part, i) => acc + `$${i}` + part);
  const res = await getPool().query(text, values);
  return res.rows;
}

/** Consultas con template: db()`select ... where id = ${id}` (los valores van como parámetros). */
export function db() {
  return sql;
}
