import "server-only";
import { SITE_NAME } from "./site";

// Emails a profes y al admin, con Resend (https://resend.com, gratis hasta 3.000/mes).
// Hace falta: RESEND_API_KEY, EMAIL_FROM (ej. "Tirita <hola@tudominio.com.ar>",
// con el dominio verificado en Resend) y SITE_URL (ej. https://tudominio.com.ar).
// Si falta algo, no se manda nada y la acción sigue igual.

export function emailConfigured() {
  return !!process.env.RESEND_API_KEY && !!process.env.EMAIL_FROM && !!process.env.SITE_URL;
}

function siteUrl(path = "") {
  return `${(process.env.SITE_URL ?? "").replace(/\/+$/, "")}${path}`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Arma un email simple: saludo, párrafos y un botón. */
function layout(paragraphs: string[], button?: { label: string; href: string }) {
  const body = paragraphs.map((p) => `<p style="margin:0 0 14px">${escapeHtml(p)}</p>`).join("");
  const cta = button
    ? `<p style="margin:22px 0"><a href="${button.href}" style="background:#1f3a93;color:#fff;padding:12px 18px;border-radius:4px;text-decoration:none;font-weight:600">${escapeHtml(button.label)}</a></p>`
    : "";
  const html = `<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.5;color:#1b1e24;max-width:520px">${body}${cta}<p style="margin:24px 0 0;color:#4a5160;font-size:14px">${escapeHtml(SITE_NAME)} · Gratis para alumnos y profes</p></div>`;
  const text = [...paragraphs, button ? `${button.label}: ${button.href}` : "", `— ${SITE_NAME}`]
    .filter(Boolean)
    .join("\n\n");
  return { html, text };
}

async function send(to: string | string[], subject: string, content: { html: string; text: string }) {
  if (!emailConfigured()) {
    console.info(`[email desactivado] "${subject}" a ${String(to)}`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject, html: content.html, text: content.text }),
    });
    if (!res.ok) console.error("email failed", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("email failed", err);
    return false;
  }
}

const first = (name: string) => name.trim().split(/\s+/)[0] ?? name;

export function emailTeacherApproved(t: { email: string; name: string; id: string }) {
  return send(
    t.email,
    "¡Tu perfil ya está publicado!",
    layout(
      [
        `Hola ${first(t.name)}:`,
        "Revisamos tu perfil y ya está publicado. Los alumnos te pueden encontrar por tus materias y escribirte directo a tu WhatsApp.",
        "Compartí el link de tu perfil en tus grupos y redes: es la forma más rápida de conseguir los primeros alumnos.",
      ],
      { label: "Ver mi perfil", href: siteUrl(`/profesor/${t.id}`) },
    ),
  );
}

export function emailTeacherRejected(t: { email: string; name: string }) {
  return send(
    t.email,
    "Sobre tu perfil",
    layout(
      [
        `Hola ${first(t.name)}:`,
        "Revisamos tu perfil y por ahora no lo pudimos publicar. Puede faltar información (materias, descripción) o algún dato no se pudo verificar.",
        "Podés completarlo desde Mi perfil, o respondernos este email y lo vemos juntos.",
      ],
      { label: "Ir a Mi perfil", href: siteUrl("/mi-perfil") },
    ),
  );
}

export function emailTeacherHidden(t: { email: string; name: string }) {
  return send(
    t.email,
    "Ocultamos tu perfil",
    layout(
      [
        `Hola ${first(t.name)}:`,
        "Ocultamos tu perfil de las búsquedas. Suele pasar cuando los alumnos nos cuentan que no reciben respuesta.",
        "Si querés volver a aparecer, respondé este email y lo reactivamos.",
      ],
      { label: "Ir a Mi perfil", href: siteUrl("/mi-perfil") },
    ),
  );
}

export function emailSubjectAdded(t: { email: string; name: string }, subject: string) {
  return send(
    t.email,
    `Sumamos ${subject} a tu perfil`,
    layout(
      [
        `Hola ${first(t.name)}:`,
        `Agregamos "${subject}" a la lista de materias y ya figura en tu perfil. Ahora los alumnos te encuentran cuando la buscan.`,
      ],
      { label: "Ver Mi perfil", href: siteUrl("/mi-perfil") },
    ),
  );
}

/** Aviso al admin: llegó un perfil nuevo para revisar. */
export function emailAdminNewTeacher(name: string) {
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  if (admins.length === 0) return Promise.resolve(false);
  return send(
    admins,
    `Nuevo profe para revisar: ${name}`,
    layout([`${name} mandó su perfil.`], { label: "Revisar en el admin", href: siteUrl("/admin") }),
  );
}
