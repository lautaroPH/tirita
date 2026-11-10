# Tirita — profes particulares en La Plata

Buscador gratuito de profes particulares en La Plata (secundaria y UNLP).
Next.js 16 (App Router) + Neon (Postgres + Neon Auth con Google).

## Qué tiene

- `/` buscador por materia (64 materias con nombres oficiales de la UNLP), nivel y modalidad
- `/profesor/[id]` aviso del profe: precio, materias, Instagram/LinkedIn, reseñas y tirita de WhatsApp
- `/contacto/[id]` cuenta el clic y abre WhatsApp con un mensaje armado
- `/sumate` alta de profes (con cuenta de Google); materias que no están en la lista quedan como pedido
- `/mi-perfil` el profe edita, pausa o borra su perfil
- `/entrar` login con Google (alumnos para reseñar, profes y admin)
- `/admin` solo para los emails de `ADMIN_EMAILS`: aprobar profes, materias pedidas, reseñas,
  pedidos de baja y métricas (contactos por semana, búsquedas, vistas)
- `/privacidad` y `/baja` (Ley 25.326)
- `/foto/[id]` fotos de los profes, guardadas en la propia base (WebP de 480 px)

Límites contra spam en Postgres (`rate_events`): reseñas, altas, ediciones y pedidos de baja.

## Puesta en marcha

1. `neon init` en esta carpeta y `neon deploy` (neon.ts ya tiene `auth: true`): eso escribe
   `DATABASE_URL`, `DATABASE_URL_UNPOOLED` y `NEON_AUTH_BASE_URL` en `.env.local`.
2. Completar en `.env.local` (ver `.env.example`):
   - `NEON_AUTH_COOKIE_SECRET` (32+ caracteres al azar)
   - `ADMIN_EMAILS` (tu cuenta de Google)
3. Crear tablas y cargar materias:

   ```bash
   npm run db:setup
   ```

4. Opcional, profes de prueba (no en producción):

   ```bash
   npm run db:demo
   ```

5. `npm run dev` y abrir http://localhost:3000

## Login con Google propio (antes de lanzar)

Neon Auth trae credenciales compartidas de Google para desarrollo (Google muestra "neon.tech").
Para producción, crear un OAuth client (Web) en Google Cloud con el redirect URI
`<NEON_AUTH_BASE_URL>/callback/google` y cargarlo:

```bash
neon neon-auth oauth-provider update --provider-id google --oauth-client-id ID --oauth-client-secret SECRETO
```

Y agregar el dominio real a los dominios de confianza:

```bash
neon neon-auth domain add https://tudominio.com.ar
```

## Deploy (Vercel)

Cargar las mismas variables de entorno (`DATABASE_URL`, `NEON_AUTH_BASE_URL`,
`NEON_AUTH_COOKIE_SECRET`, `ADMIN_EMAILS`). Correr `npm run db:setup` una vez contra la base
de producción. No correr `db:demo` en producción.

## Cosas para cambiar

- Nombre: `src/lib/site.ts` (`SITE_NAME`).
- Materias: `db/seed.sql` (fuente: planes de estudio de cada facultad, noviembre 2026) o desde `/admin`.
- Fotos: todo el manejo está en `src/lib/photos.ts`; para pasar a R2 o Vercel Blob alcanza con ese archivo.
