-- Profesores de PRUEBA para desarrollo local. No correr en producción.
-- Borrarlos: delete from teachers where email like '%@demo.invalid';

insert into teachers (id, name, bio, rate_per_hour, modality, zone, whatsapp, email, status, approved_at) values
  ('00000000-0000-4000-8000-000000000001', 'Demo Ana Pérez',
   'Ayudante de cátedra en Matemática A. Preparo parciales y finales.', 18000, 'ambas', 'Centro',
   '5492210000001', 'ana@demo.invalid', 'approved', now()),
  ('00000000-0000-4000-8000-000000000002', 'Demo Bruno Díaz',
   'Estudiante avanzado de Informática. Programación desde cero.', 15000, 'online', 'Online',
   '5492210000002', 'bruno@demo.invalid', 'approved', now()),
  ('00000000-0000-4000-8000-000000000003', 'Demo Carla Gómez',
   'Profesora de secundaria. Matemática y Física para todos los años.', 15000, 'presencial', 'Tolosa',
   '5492210000003', 'carla@demo.invalid', 'approved', now())
on conflict (id) do nothing;

insert into teacher_subjects (teacher_id, subject_id)
select t.id::uuid, s.id from (values
  ('00000000-0000-4000-8000-000000000001', 'matematica-a-ingenieria'),
  ('00000000-0000-4000-8000-000000000001', 'analisis-i-exactas'),
  ('00000000-0000-4000-8000-000000000002', 'cadp-informatica'),
  ('00000000-0000-4000-8000-000000000002', 'matematica-1-informatica'),
  ('00000000-0000-4000-8000-000000000003', 'matematica-secundaria'),
  ('00000000-0000-4000-8000-000000000003', 'fisica-secundaria')
) as t(id, slug)
join subjects s on s.slug = t.slug
on conflict do nothing;

insert into reviews (teacher_id, author_name, rating, comment, status)
select '00000000-0000-4000-8000-000000000001', 'Juli', 5, 'Me salvó el parcial. Explica muy claro.', 'approved'
where not exists (select 1 from reviews where teacher_id = '00000000-0000-4000-8000-000000000001');
