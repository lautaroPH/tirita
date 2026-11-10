// Nombre del sitio. El dominio y las redes van a ser "tirita".
export const SITE_NAME = "Tirita";
export const SITE_TAGLINE = "Profes particulares en La Plata. Gratis de verdad, sin suscripciones.";

// Responsable de la base de datos (Ley 25.326, art. 6): quién está detrás del sitio
// y cómo contactarlo. Completalo antes de lanzar; la página de privacidad lo muestra.
export const LEGAL = {
  responsible: "", // ej. "Lautaro Pérez" o la razón social si armás una empresa
  email: "", // ej. "hola@tudominio.com.ar"
  city: "La Plata, Buenos Aires",
};

export type Level = "secundaria" | "universidad";
export type Modality = "presencial" | "online" | "ambas";

export const LEVEL_LABEL: Record<Level, string> = {
  secundaria: "Secundaria",
  universidad: "Universidad (UNLP)",
};

export const MODALITY_LABEL: Record<Modality, string> = {
  presencial: "Presencial",
  online: "Online",
  ambas: "Presencial y online",
};

/** Cada facultad viaja en su "línea": un color y un código de tres letras. */
export type Line = { key: string; code: string; label: string };

const LINES: Record<string, Line> = {
  "Ingeniería": { key: "ing", code: "ING", label: "Ingeniería" },
  "Exactas": { key: "exa", code: "EXA", label: "Exactas" },
  "Informática": { key: "inf", code: "INF", label: "Informática" },
  "Económicas": { key: "eco", code: "ECO", label: "Económicas" },
  "Medicina": { key: "med", code: "MED", label: "Medicina" },
  "Derecho": { key: "der", code: "DER", label: "Derecho" },
  "Arquitectura": { key: "arq", code: "ARQ", label: "Arquitectura" },
  "Naturales": { key: "nat", code: "NAT", label: "Naturales" },
  "Humanidades": { key: "hum", code: "HUM", label: "Humanidades" },
};

export function lineFor(area: string | null, level: Level): Line {
  if (level === "secundaria") return { key: "sec", code: "SEC", label: "Secundaria" };
  if (area && LINES[area]) return LINES[area];
  const label = area ?? "Universidad";
  const code = label
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .slice(0, 3)
    .toUpperCase();
  return { key: "otra", code, label };
}

export function formatPesos(n: number) {
  return "$" + new Intl.NumberFormat("es-AR").format(n);
}

/**
 * Normaliza un celular argentino al formato de wa.me (549 + área + número).
 * Acepta "221 555-1234", "0221 15 555 1234", "+54 9 221 5551234", etc.
 */
export function normalizeWhatsapp(input: string): string | null {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("54")) d = d.slice(2);
  if (d.startsWith("9")) d = d.slice(1);
  if (d.startsWith("0")) d = d.slice(1);
  // Quita el "15" después del código de área (área de 2 a 4 dígitos).
  if (d.length === 12) {
    for (const areaLen of [2, 3, 4]) {
      if (d.slice(areaLen, areaLen + 2) === "15") {
        d = d.slice(0, areaLen) + d.slice(areaLen + 2);
        break;
      }
    }
  }
  if (d.length !== 10) return null;
  return "549" + d;
}

/**
 * Instagram o LinkedIn del profe. Acepta "@usuario", "usuario" (Instagram)
 * o un link de instagram.com / linkedin.com. Devuelve la URL limpia o null.
 */
export function normalizeSocial(input: string): string | null {
  const v = input.trim();
  if (!v) return null;
  const handle = v.replace(/^@/, "");
  if (/^[a-z0-9._]{1,30}$/i.test(handle)) return `https://www.instagram.com/${handle}/`;
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    const host = u.hostname.replace(/^www\./, "").toLowerCase();
    if (host !== "instagram.com" && host !== "linkedin.com" && !host.endsWith(".linkedin.com")) return null;
    return `https://${u.hostname}${u.pathname}`.replace(/\/+$/, "/");
  } catch {
    return null;
  }
}

/** Cómo mostrar el link: "Instagram @usuario" o "LinkedIn". */
export function socialLabel(url: string) {
  const u = new URL(url);
  if (u.hostname.includes("instagram.com")) {
    const user = u.pathname.split("/").filter(Boolean)[0];
    return user ? `Instagram @${user}` : "Instagram";
  }
  return "LinkedIn";
}

export function whatsappUrl(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/** Primer nombre para las tiritas y el saludo ("Juan Pérez García" → "Juan"). */
export function firstName(name: string) {
  const words = name.replace(/^Demo\s+/i, "").split(/\s+/).filter(Boolean);
  return words[0] ?? name;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
