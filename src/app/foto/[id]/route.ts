import { db } from "@/lib/db";
import { UUID_RE } from "@/lib/site";

// Sirve las fotos de los profes guardadas en la base. Cada foto nueva tiene id
// nuevo, así que se puede cachear para siempre (navegador y CDN).
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) return new Response("No encontrada", { status: 404 });

  const rows = await db()`select content_type, data from photos where id = ${id}::uuid`;
  const photo = rows[0];
  if (!photo) return new Response("No encontrada", { status: 404 });

  return new Response(new Uint8Array(photo.data as Buffer), {
    headers: {
      "content-type": photo.content_type as string,
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
    },
  });
}
