import { after, type NextRequest } from "next/server";
import { getSubjectBySlug, getTeacherWhatsapp, subjectLabel } from "@/lib/queries";
import { SITE_NAME, UUID_RE, firstName, whatsappUrl } from "@/lib/site";
import { track } from "@/lib/track";

// Pasa por acá antes de ir a WhatsApp para contar el clic (la métrica principal).
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) return new Response("No encontrado", { status: 404 });

  const teacher = await getTeacherWhatsapp(id);
  if (!teacher) return new Response("No encontrado", { status: 404 });

  const slug = req.nextUrl.searchParams.get("materia");
  const subject = slug ? await getSubjectBySlug(slug) : null;

  const first = firstName(teacher.name);
  const text = subject
    ? `Hola ${first}, te encontré en ${SITE_NAME}. Quería consultarte por clases de ${subjectLabel(subject)}.`
    : `Hola ${first}, te encontré en ${SITE_NAME}. Quería consultarte por clases particulares.`;

  after(() => track("whatsapp_click", { teacherId: id, subjectId: subject?.id }));

  // Profe de ejemplo: no abrimos ningún chat (el número no es de nadie);
  // mostramos qué pasaría con un profe real.
  if (teacher.demo) {
    const demo = new URL("/contacto/ejemplo", req.nextUrl.origin);
    demo.searchParams.set("nombre", first);
    demo.searchParams.set("mensaje", text);
    demo.searchParams.set("profe", id);
    return Response.redirect(demo, 302);
  }

  return Response.redirect(whatsappUrl(teacher.whatsapp, text), 302);
}
