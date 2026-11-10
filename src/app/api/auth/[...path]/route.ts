import { auth, authConfigured } from "@/lib/auth/server";

// Proxy al servidor de Neon Auth (login con Google, sesión, salir).
const handlers = auth.handler();

type Handler = (typeof handlers)["GET"];

// Mientras Neon Auth no esté configurado (falta NEON_AUTH_BASE_URL), responde 503 en vez de fallar.
function guard(h: Handler): Handler {
  return ((...args: Parameters<Handler>) =>
    authConfigured()
      ? h(...args)
      : Response.json({ error: "El login todavía no está configurado" }, { status: 503 })) as Handler;
}

export const GET = guard(handlers.GET);
export const POST = guard(handlers.POST);
export const PUT = guard(handlers.PUT);
export const DELETE = guard(handlers.DELETE);
export const PATCH = guard(handlers.PATCH);
