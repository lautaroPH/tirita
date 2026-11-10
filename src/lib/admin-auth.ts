import "server-only";
import { redirect } from "next/navigation";
import { currentUser, isAdminEmail } from "./auth/server";

// El admin entra con Google: solo las cuentas listadas en ADMIN_EMAILS.
// Ya no hay contraseña compartida.

export async function isAdmin() {
  const user = await currentUser();
  return !!user && isAdminEmail(user.email);
}

export async function requireAdmin() {
  const user = await currentUser();
  if (!user) redirect("/entrar?volver=/admin");
  if (!isAdminEmail(user.email)) redirect("/admin/sin-acceso");
  return user;
}
