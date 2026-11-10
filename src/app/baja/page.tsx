import type { Metadata } from "next";
import Link from "next/link";
import { BajaForm } from "./BajaForm";

export const metadata: Metadata = { title: "Baja y correcciones" };

export default function BajaPage() {
  return (
    <div className="paper space-y-5 p-4 sm:p-8">
      <div>
        <h1 className="display text-[clamp(2rem,9vw,2.75rem)]">Baja y correcciones</h1>
        <p className="mt-2 max-w-[62ch] text-g4">
          ¿Sos profe y tenés cuenta? Desde{" "}
          <Link href="/mi-perfil" className="font-semibold text-pen underline">
            Mi perfil
          </Link>{" "}
          podés editar, pausar o borrar tu perfil al instante. Para todo lo demás, completá este formulario. Más
          información en{" "}
          <Link href="/privacidad" className="font-semibold text-pen underline">
            Privacidad
          </Link>
          .
        </p>
      </div>
      <BajaForm />
    </div>
  );
}
