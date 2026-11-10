# Publicar Tirita gratis (piloto en tirita.vercel.app)

Todo gratis: Vercel Hobby (uso no comercial), Neon plan gratis, login de Google con las
credenciales compartidas de Neon (Google muestra "neon.tech" hasta que tengas las propias).

## 1. Subir el código a GitHub

1. Crear un repositorio **privado** vacío en GitHub llamado `tirita` (sin README ni .gitignore).
2. En esta carpeta:

   ```bash
   git remote add origin https://github.com/TU_USUARIO/tirita.git
   ```

   ```bash
   git push -u origin main
   ```

## 2. Crear el proyecto en Vercel

1. Entrar a https://vercel.com con tu cuenta de GitHub (plan Hobby, gratis).
2. **Add New → Project** → importar el repositorio `tirita`. Vercel detecta Next.js solo.
3. **Project Name:** `tirita` (así queda `tirita.vercel.app`; si está ocupado, Vercel propone otro).
4. **Environment Variables** (copiar los valores de `.env.local`):

   | Variable | De dónde sale |
   | --- | --- |
   | `DATABASE_URL` | `.env.local` (la que tiene `-pooler`) |
   | `NEON_AUTH_BASE_URL` | `.env.local` |
   | `NEON_AUTH_COOKIE_SECRET` | Generá uno nuevo para producción (32+ caracteres): `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
   | `ADMIN_EMAILS` | `lautaroph@gmail.com` |
   | `SITE_URL` | `https://tirita.vercel.app` (o el nombre que te dé Vercel) |

   `RESEND_API_KEY` y `EMAIL_FROM` quedan vacías hasta tener dominio propio.
5. **Deploy.**

## 3. Poner el servidor cerca de la base

La base está en São Paulo. Por defecto Vercel corre el sitio en Washington, y cada consulta
cruzaría el continente. En el proyecto de Vercel: **Settings → Functions → Function Region**
→ elegir **São Paulo, Brazil (gru1)** → guardar y volver a hacer deploy (Deployments → Redeploy).

## 4. Habilitar el login en el dominio nuevo

Neon Auth solo acepta logins desde dominios de confianza. Con la dirección final de Vercel:

```bash
neon neon-auth domain add https://tirita.vercel.app
```

## 5. Probar en línea

- Buscar una materia, abrir el formulario de Sumate y entrar con Google.
- Crear tu perfil de prueba, aprobarlo en `/admin`, verlo en el buscador, borrarlo desde Mi perfil.
- Probar en el celular.

## Para tener en cuenta

- **Una sola base:** el sitio local (`npm run dev`) y el publicado usan la misma base de Neon.
  Lo que pruebes en local aparece online. Para separarlos más adelante: `neon checkout dev --create`
  y usar esa rama en `.env.local`.
- **Cada `git push` a `main` publica solo** una versión nueva en Vercel.
- **Cuando haya dominio propio:** sumarlo en Vercel (Settings → Domains), agregarlo con
  `neon neon-auth domain add`, cambiar `SITE_URL`, y activar los emails con Resend.
