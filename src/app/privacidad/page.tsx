import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = { title: "Privacidad" };

// Política de privacidad (Ley 25.326 de Protección de Datos Personales).
export default function PrivacidadPage() {
  return (
    <article className="paper space-y-6 p-4 leading-relaxed sm:p-8">
      <header>
        <h1 className="display text-[clamp(2rem,9vw,2.75rem)]">Privacidad</h1>
        <p className="mt-1 text-g4">Cómo usamos tus datos en {SITE_NAME}. Última actualización: noviembre de 2026.</p>
      </header>

      {LEGAL.responsible && LEGAL.email && (
        <Section title="Quién es responsable">
          <p>
            Responsable de la base de datos: <strong>{LEGAL.responsible}</strong>, {LEGAL.city}. Contacto:{" "}
            <a href={`mailto:${LEGAL.email}`} className="font-semibold text-pen underline">
              {LEGAL.email}
            </a>
            .
          </p>
        </Section>
      )}

      <Section title="Qué datos guardamos">
        <p>
          <strong>Si sos profe:</strong> tu nombre, el email de tu cuenta de Google, tu WhatsApp, materias, tarifa,
          modalidad, zona, descripción, y si los cargás, tu foto y tu Instagram o LinkedIn.
        </p>
        <p>
          <strong>Si dejás una reseña:</strong> tu cuenta de Google (para que haya una sola reseña por persona y por
          profe), tu primer nombre, el puntaje y el comentario.
        </p>
        <p>
          <strong>Si solo buscás profes:</strong> no te pedimos ningún dato. Contamos visitas, búsquedas y clics en
          WhatsApp de forma anónima, sin cookies de seguimiento, para saber si la página sirve.
        </p>
      </Section>

      <Section title="Qué se publica">
        <p>
          Del perfil de un profe se publican el nombre, la foto, las materias, la tarifa, la modalidad, la zona, la
          descripción y el Instagram o LinkedIn. El WhatsApp se usa para abrir la conversación cuando un alumno toca
          &quot;Escribir por WhatsApp&quot;. El email nunca se publica. De las reseñas se publica solo el primer
          nombre.
        </p>
      </Section>

      <Section title="Para qué los usamos">
        <p>
          Solo para que alumnos y profes se encuentren, para revisar perfiles y reseñas, y para evitar spam. No
          vendemos ni compartimos tus datos con nadie. Los guardamos en servicios de terceros que usamos para que el
          sitio funcione (base de datos, login con Google y almacenamiento de fotos).
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          Usamos una sola cookie, la de tu sesión cuando entrás con Google. Para frenar el spam guardamos por dos días
          un código derivado de tu conexión, que no permite saber tu IP.
        </p>
      </Section>

      <Section title="Tus derechos">
        <p>
          Podés pedir ver, corregir o borrar tus datos cuando quieras y sin costo (Ley 25.326, art. 14 a 16):
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Si sos profe:</strong> entrá a{" "}
            <Link href="/mi-perfil" className="font-semibold text-pen underline">
              Mi perfil
            </Link>{" "}
            para editar, pausar o borrar tu perfil al instante.
          </li>
          <li>
            <strong>Para todo lo demás</strong> (borrar una reseña, corregir datos, si perdiste el acceso):{" "}
            <Link href="/baja" className="font-semibold text-pen underline">
              pedí la baja o la corrección acá
            </Link>
            . Respondemos dentro de los 10 días hábiles que fija la ley.
          </li>
        </ul>
        <p className="text-sm text-g4">
          La Agencia de Acceso a la Información Pública (AAIP) es el órgano de control de la Ley 25.326 y recibe
          denuncias y reclamos sobre el incumplimiento de las normas de protección de datos personales.
        </p>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="max-w-[68ch] space-y-2">
      <h2 className="display text-2xl">{title}</h2>
      {children}
    </section>
  );
}
