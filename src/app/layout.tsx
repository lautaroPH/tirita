import type { Metadata } from "next";
import Link from "next/link";
import { Archivo, Kalam } from "next/font/google";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
});

// Solo para los nombres escritos a mano en las tiritas.
const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: { default: `${SITE_NAME} · Profes particulares en La Plata`, template: `%s · ${SITE_NAME}` },
  description: SITE_TAGLINE,
  applicationName: SITE_NAME,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: extensiones del navegador (p. ej. Scribe) agregan atributos
    // al <html> antes de que cargue React. Solo afecta los atributos de esta etiqueta.
    <html lang="es" suppressHydrationWarning>
      <body className={`${archivo.variable} ${kalam.variable} font-sans antialiased`}>
        <header className="border-b border-g2 bg-paper">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3.5">
            <Link href="/" className="flex items-baseline gap-2" aria-label={`${SITE_NAME}, inicio`}>
              <span className="display highlight text-2xl" style={{ background: "var(--highlight)" }}>
                {SITE_NAME}
              </span>
              <span className="hidden text-sm font-medium text-g4 min-[360px]:inline">profes en La Plata</span>
            </Link>
            <Link href="/sumate" className="text-[15px] font-semibold text-pen underline-offset-4 hover:underline">
              Soy profe
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 pb-12 pt-6">{children}</main>
        <footer className="mx-auto max-w-3xl px-4 pb-10">
          <div className="paper px-4 py-4 text-sm text-g4">
            <p className="display text-base text-ink">{SITE_NAME}</p>
            <p className="mt-1">
              Gratis para alumnos y profes. Sin pases, sin suscripciones, sin muros para ver el contacto.
            </p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/mi-perfil" className="text-pen underline">
                Mi perfil (profes)
              </Link>
              <Link href="/privacidad" className="text-pen underline">
                Privacidad
              </Link>
              <Link href="/baja" className="text-pen underline">
                Baja y correcciones
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
