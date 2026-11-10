-- Esquema de la Etapa 1. Se puede correr varias veces sin romper nada.

create table if not exists subjects (
  id serial primary key,
  slug text unique not null,
  name text not null,
  level text not null check (level in ('secundaria', 'universidad')),
  area text,
  sort int not null default 0
);

create table if not exists teachers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo_url text,
  bio text not null default '',
  rate_per_hour int,
  modality text not null check (modality in ('presencial', 'online', 'ambas')),
  zone text not null default '',
  whatsapp text not null,
  email text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'hidden', 'rejected')),
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create index if not exists teachers_status on teachers (status);

create table if not exists teacher_subjects (
  teacher_id uuid not null references teachers (id) on delete cascade,
  subject_id int not null references subjects (id) on delete cascade,
  primary key (teacher_id, subject_id)
);

create table if not exists reviews (
  id serial primary key,
  teacher_id uuid not null references teachers (id) on delete cascade,
  author_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved')),
  created_at timestamptz not null default now()
);

create index if not exists reviews_teacher on reviews (teacher_id, status);

-- Instagram o LinkedIn del profe (opcional, público) para que se pueda chequear su carrera.
alter table teachers add column if not exists social_url text;

-- Materias que el profe escribe porque no están en la lista. El admin las aprueba:
-- al aprobar se crea la materia y se vincula al profe.
create table if not exists subject_requests (
  id serial primary key,
  teacher_id uuid not null references teachers (id) on delete cascade,
  name text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists subject_requests_status on subject_requests (status);

-- Reseñas con login: quién la escribió (id de usuario de Neon Auth), una por profe.
alter table reviews add column if not exists user_id text;
create unique index if not exists reviews_one_per_user on reviews (teacher_id, user_id) where user_id is not null;

-- Cuenta de Google del profe (Neon Auth): con ella entra a "Mi perfil".
alter table teachers add column if not exists user_id text;
create unique index if not exists teachers_user_id on teachers (user_id) where user_id is not null;
-- El profe puede pausar su perfil sin borrarlo (distinto de "oculto" por el admin).
alter table teachers add column if not exists paused boolean not null default false;
alter table teachers add column if not exists updated_at timestamptz;

-- Fotos de los profes, guardadas en la propia base (ya achicadas a ~50 KB en WebP).
-- teachers.photo_url apunta a /foto/<id>; cada foto nueva tiene id nuevo, así se cachea para siempre.
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references teachers (id) on delete cascade,
  content_type text not null default 'image/webp',
  data bytea not null,
  created_at timestamptz not null default now()
);
create index if not exists photos_teacher on photos (teacher_id);

-- Pedidos de baja o de corrección de datos (Ley 25.326) de quien no tiene cuenta.
create table if not exists removal_requests (
  id serial primary key,
  name text not null,
  contact text not null,
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'done')),
  created_at timestamptz not null default now()
);

-- Límites contra spam: cada acción guarda quién (usuario o IP con hash) y cuándo.
create table if not exists rate_events (
  id bigserial primary key,
  action text not null,
  actor text not null,
  created_at timestamptz not null default now()
);
create index if not exists rate_events_lookup on rate_events (action, actor, created_at);

-- Medición básica: home_view, search, profile_view, whatsapp_click
create table if not exists events (
  id bigserial primary key,
  type text not null,
  teacher_id uuid references teachers (id) on delete set null,
  subject_id int references subjects (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists events_type_created on events (type, created_at);
create index if not exists events_teacher on events (teacher_id, type);
