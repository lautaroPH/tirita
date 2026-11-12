import type { Metadata } from "next";
import Link from "next/link";
import { WhatsappIcon } from "@/components/Icons";
import { UUID_RE } from "@/lib/site";

export const metadata: Metadata = { title: "Ejemplo de contacto", robots: { index: false } };

type SearchParams = Promise<{ nombre?: string; mensaje?: string; profe?: string }>;

// Lo que ve quien toca "WhatsApp" en un profe de ejemplo: explica qué pasaría con uno real.
export default async function ContactoEjemplo({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const nombre = (sp.nombre ?? "el profe").slice(0, 40);
  const mensaje = (sp.mensaje ?? "").slice(0, 300);
  const volver = sp.profe && UUID_RE.test(sp.profe) ? `/profesor/${sp.profe}` : "/";

  return (
    <div className="paper mx-auto max-w-lg space-y-5 p-5 sm:p-8">
      <p className="inline-block rounded bg-g1 px-2 py-0.5 text-sm font-semibold text-g4">Perfil de ejemplo</p>
      <h1 className="display text-3xl">Así se contacta a un profe</h1>
      <p className="text-g4">
        {nombre} es un profe de ejemplo, así que no abrimos ningún chat. Con un profe real, en este momento se abre
        WhatsApp con este mensaje ya escrito:
      </p>
      {mensaje && (
        <div className="flex gap-3 rounded border border-g2 bg-[#e7f6ea] p-4">
          <WhatsappIcon className="mt-0.5 shrink-0 text-[#1f8f4c]" />
          <p className="font-medium">{mensaje}</p>
        </div>
      )}
      <p className="text-g4">
        El alumno manda el mensaje y arregla la clase directo con el profe. Tirita no cobra nada ni se mete en la
        conversación.
      </p>
      <Link href={volver} className="btn-primary">
        Volver
      </Link>
    </div>
  );
}
