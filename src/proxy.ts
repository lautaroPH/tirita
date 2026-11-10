import { auth } from "@/lib/auth/server";

// Middleware de Neon Auth. Hace dos cosas:
// 1. Al volver de Google, cambia el código de un solo uso por la cookie de sesión
//    (sin esto, el login con Google "no hace nada").
// 2. Mantiene la sesión al día.
// Ninguna ruta se bloquea acá: "Mi perfil" y el admin piden login en la propia página
// (requireUser / requireAdmin), que manda a /entrar recordando a dónde volver.
export default auth.middleware({
  loginUrl: "/entrar",
  publicRoutes: ["/", "/profesor", "/contacto", "/foto", "/sumate", "/entrar", "/privacidad", "/baja", "/mi-perfil", "/admin"],
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
