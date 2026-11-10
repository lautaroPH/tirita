// Corre archivos .sql contra Neon: tsx --env-file=.env.local scripts/db.ts db/schema.sql ...
// Usa la conexión directa (sin -pooler), como recomienda Neon para migraciones.
import { Client } from "pg";
import { readFileSync } from "node:fs";

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.error("Falta DATABASE_URL_UNPOOLED o DATABASE_URL en .env.local");
  process.exit(1);
}

async function main() {
  const client = new Client({
    connectionString: url!.replace(/sslmode=(require|prefer|verify-ca)\b/, "sslmode=verify-full"),
  });
  await client.connect();
  try {
    for (const file of process.argv.slice(2)) {
      // Sin parámetros, pg acepta varias sentencias juntas; todo en una transacción.
      await client.query(`begin;\n${readFileSync(file, "utf8")}\ncommit;`);
      console.log(`OK ${file}`);
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
