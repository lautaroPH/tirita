import "server-only";
import { createNeonAuth } from "@neon/auth/next/server";
import { redirect } from "next/navigation";

// Login con Google (Neon Auth). Lo usan los alumnos para reseñar, los profes para
// su perfil y el admin. Buscar profes y escribirles por WhatsApp sigue sin cuenta.
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL ?? "",
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET ?? "" },
});

export function authConfigured() {
  return !!process.env.NEON_AUTH_BASE_URL && (process.env.NEON_AUTH_COOKIE_SECRET?.length ?? 0) >= 32;
}

export type CurrentUser = { id: string; name: string; email: string };

/** El usuario con sesión, o null. Nunca rompe la página si Auth no está configurado. */
export async function currentUser(): Promise<CurrentUser | null> {
  if (!authConfigured()) return null;
  try {
    const { data: session } = await auth.getSession();
    const user = session?.user;
    if (!user) return null;
    const email = (user.email ?? "").toLowerCase();
    return { id: user.id, email, name: user.name || email.split("@")[0] || "Usuario" };
  } catch (err) {
    console.error("getSession failed", err);
    return null;
  }
}

/** Alias usado por las reseñas. */
export const currentStudent = currentUser;

/** Emails de Google con acceso al admin (ADMIN_EMAILS, separados por coma). */
export function isAdminEmail(email: string) {
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

/** Página o acción que exige sesión: si no hay, manda a /entrar y vuelve después. */
export async function requireUser(returnTo: string): Promise<CurrentUser> {
  const user = await currentUser();
  if (!user) redirect(`/entrar?volver=${encodeURIComponent(returnTo)}`);
  return user;
}
