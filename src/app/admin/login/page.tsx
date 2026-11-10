import { redirect } from "next/navigation";

// El admin ahora entra con Google (ADMIN_EMAILS). Esta ruta queda por compatibilidad.
export default function LoginPage() {
  redirect("/entrar?volver=/admin");
}
