-- Profes y reseñas DE EJEMPLO para mostrar cómo funciona Tirita.
-- Todos usan emails @demo.invalid: la web los marca como "Ejemplo" y su botón de
-- WhatsApp no abre ningún chat. Los nombres son inventados.
-- Cargar:  npm run db:demo        (Neon, la web publicada)   /  npm run db:demo:local
-- Borrar:  npm run db:demo:remove (o db:demo:remove:local)
-- Se puede correr varias veces: primero borra los ejemplos anteriores.

delete from teachers where email like '%@demo.invalid';

insert into teachers (id, name, bio, rate_per_hour, modality, zone, whatsapp, email, social_url, status, approved_at) values
  ('00000000-0000-4000-8000-000000000001', 'Valentina Ríos',
   'Estudio Ingeniería Civil (4º año) y soy ayudante alumna de Matemática A. Preparo parciales y finales con ejercicios de exámenes viejos. Clases de 1 a 3 personas.',
   16000, 'ambas', 'Centro', '5492210000001', 'valentina@demo.invalid', 'https://www.instagram.com/ejemplo.tirita/', 'approved', now() - interval '20 days'),
  ('00000000-0000-4000-8000-000000000002', 'Joaquín Ferreyra',
   'Licenciado en Física (UNLP). Doy Física I y II con mucha práctica y explicando el porqué de cada fórmula. Tengo apuntes propios.',
   17000, 'presencial', 'Tolosa', '5492210000002', 'joaquin@demo.invalid', null, 'approved', now() - interval '18 days'),
  ('00000000-0000-4000-8000-000000000003', 'Camila Ortiz',
   'Programadora y estudiante avanzada de Informática. Te ayudo con CADP y Taller desde cero: pensar el algoritmo antes de escribir código.',
   15000, 'online', 'Online', '5492210000003', 'camila@demo.invalid', 'https://www.linkedin.com/in/ejemplo-tirita/', 'approved', now() - interval '15 days'),
  ('00000000-0000-4000-8000-000000000004', 'Martín Sosa',
   'Contador Público (UNLP). Contabilidad I y Matemática I para Económicas. Armo simulacros de parcial con los temas de la cátedra.',
   18000, 'ambas', 'Barrio Norte', '5492210000004', 'martin@demo.invalid', null, 'approved', now() - interval '14 days'),
  ('00000000-0000-4000-8000-000000000005', 'Lucía Benítez',
   'Médica residente. Anatomía y Citología con láminas, esquemas y repaso para orales.',
   20000, 'presencial', 'La Loma', '5492210000005', 'lucia@demo.invalid', null, 'approved', now() - interval '12 days'),
  ('00000000-0000-4000-8000-000000000006', 'Tomás Aguirre',
   'Abogado. Introducción al Derecho, Derecho Romano e Historia Constitucional: cómo estudiar los textos y preparar el final.',
   17000, 'online', 'Online', '5492210000006', 'tomas@demo.invalid', null, 'approved', now() - interval '10 days'),
  ('00000000-0000-4000-8000-000000000007', 'Florencia Méndez',
   'Profesora de Matemática y Física para secundaria, todos los años. Mucha paciencia y ejercicios del colegio.',
   13000, 'presencial', 'Los Hornos', '5492210000007', 'florencia@demo.invalid', null, 'approved', now() - interval '9 days'),
  ('00000000-0000-4000-8000-000000000008', 'Sofía Gutiérrez',
   'Traductora pública de inglés. Clases para secundaria y preparación de exámenes internacionales.',
   14000, 'online', 'Online', '5492210000008', 'sofia@demo.invalid', 'https://www.instagram.com/ejemplo.tirita/', 'approved', now() - interval '8 days'),
  ('00000000-0000-4000-8000-000000000009', 'Nicolás Romero',
   'Bioquímico. Química para Ingeniería y Exactas: estequiometría, soluciones y equilibrio, paso a paso.',
   17000, 'ambas', 'City Bell', '5492210000009', 'nicolas@demo.invalid', null, 'approved', now() - interval '6 days'),
  ('00000000-0000-4000-8000-000000000010', 'Agustina Paz',
   'Profesora en Letras. Lengua, Literatura e Historia para secundaria: comprensión de textos, redacción y orales.',
   12000, 'presencial', 'Gonnet', '5492210000010', 'agustina@demo.invalid', null, 'approved', now() - interval '5 days'),
  ('00000000-0000-4000-8000-000000000011', 'Bruno Castillo',
   'Arquitecto. Elementos de Matemática y Física y Sistemas de Representación para primer año de Arquitectura.',
   16000, 'presencial', 'Centro', '5492210000011', 'bruno@demo.invalid', null, 'approved', now() - interval '3 days'),
  ('00000000-0000-4000-8000-000000000012', 'Julieta Morales',
   'Profesora de Matemática. Análisis Matemático I y Álgebra para Exactas, y Lógica para los profesorados.',
   16500, 'ambas', 'Villa Elisa', '5492210000012', 'julieta@demo.invalid', null, 'approved', now() - interval '1 day'),
  -- Pendiente de revisión, para mostrar el admin.
  ('00000000-0000-4000-8000-000000000013', 'Ramiro Vega',
   'Estudiante de Economía. Doy Probabilidades y Estadística y Estadística Aplicada.',
   14000, 'online', 'Online', '5492210000013', 'ramiro@demo.invalid', 'https://www.linkedin.com/in/ejemplo-tirita/', 'pending', null);

insert into teacher_subjects (teacher_id, subject_id)
select t.id::uuid, s.id from (values
  ('00000000-0000-4000-8000-000000000001', 'matematica-a-ingenieria'),
  ('00000000-0000-4000-8000-000000000001', 'matematica-b-ingenieria'),
  ('00000000-0000-4000-8000-000000000001', 'matematica-para-ingenieria'),
  ('00000000-0000-4000-8000-000000000002', 'fisica-i-ingenieria'),
  ('00000000-0000-4000-8000-000000000002', 'fisica-ii-ingenieria'),
  ('00000000-0000-4000-8000-000000000002', 'fisica-i-exactas'),
  ('00000000-0000-4000-8000-000000000003', 'cadp-informatica'),
  ('00000000-0000-4000-8000-000000000003', 'taller-programacion-informatica'),
  ('00000000-0000-4000-8000-000000000003', 'matematica-1-informatica'),
  ('00000000-0000-4000-8000-000000000004', 'contabilidad-i-economicas'),
  ('00000000-0000-4000-8000-000000000004', 'matematica-i-economicas'),
  ('00000000-0000-4000-8000-000000000004', 'matematica-ii-economicas'),
  ('00000000-0000-4000-8000-000000000005', 'anatomia-medicina'),
  ('00000000-0000-4000-8000-000000000005', 'citologia-histologia-medicina'),
  ('00000000-0000-4000-8000-000000000006', 'introduccion-derecho'),
  ('00000000-0000-4000-8000-000000000006', 'derecho-romano'),
  ('00000000-0000-4000-8000-000000000006', 'historia-constitucional-derecho'),
  ('00000000-0000-4000-8000-000000000007', 'matematica-secundaria'),
  ('00000000-0000-4000-8000-000000000007', 'fisica-secundaria'),
  ('00000000-0000-4000-8000-000000000008', 'ingles-secundaria'),
  ('00000000-0000-4000-8000-000000000009', 'quimica-ingenieria'),
  ('00000000-0000-4000-8000-000000000009', 'quimica-general-exactas'),
  ('00000000-0000-4000-8000-000000000009', 'introduccion-quimica-exactas'),
  ('00000000-0000-4000-8000-000000000010', 'lengua-literatura-secundaria'),
  ('00000000-0000-4000-8000-000000000010', 'historia-secundaria'),
  ('00000000-0000-4000-8000-000000000011', 'elementos-matematica-fisica-arquitectura'),
  ('00000000-0000-4000-8000-000000000011', 'sistemas-representacion-arquitectura'),
  ('00000000-0000-4000-8000-000000000012', 'analisis-i-exactas'),
  ('00000000-0000-4000-8000-000000000012', 'algebra-exactas'),
  ('00000000-0000-4000-8000-000000000012', 'logica-humanidades'),
  ('00000000-0000-4000-8000-000000000013', 'probabilidades-estadistica-ingenieria'),
  ('00000000-0000-4000-8000-000000000013', 'estadistica-aplicada-economicas')
) as t(id, slug)
join subjects s on s.slug = t.slug
on conflict do nothing;

-- Reseñas de ejemplo, ya aprobadas (y una pendiente para el admin).
insert into reviews (teacher_id, author_name, rating, comment, status, created_at)
select t.id::uuid, t.author, t.rating, t.comment, t.status, now() - (t.days || ' days')::interval from (values
  ('00000000-0000-4000-8000-000000000001', 'Juli', 5, 'Me salvó el primer parcial de Matemática A. Explica muy claro y tiene un montón de ejercicios.', 'approved', 12),
  ('00000000-0000-4000-8000-000000000001', 'Mateo', 5, 'Fuimos tres amigos y nos ordenó todo el tema de derivadas en dos clases.', 'approved', 8),
  ('00000000-0000-4000-8000-000000000001', 'Ana', 4, 'Muy buena. A veces cuesta conseguir horario cerca del parcial.', 'approved', 3),
  ('00000000-0000-4000-8000-000000000002', 'Lucas', 5, 'Por fin entendí cinemática. Muy paciente.', 'approved', 9),
  ('00000000-0000-4000-8000-000000000002', 'Belén', 4, 'Buenas clases, trae apuntes propios que sirven mucho.', 'approved', 4),
  ('00000000-0000-4000-8000-000000000003', 'Franco', 5, 'Aprobé CADP gracias a ella. Te enseña a pensar el problema, no a copiar código.', 'approved', 7),
  ('00000000-0000-4000-8000-000000000004', 'Rocío', 5, 'Contabilidad I explicada de diez. Los simulacros son igual que el parcial.', 'approved', 6),
  ('00000000-0000-4000-8000-000000000004', 'Ignacio', 4, 'Muy claro con los asientos.', 'approved', 2),
  ('00000000-0000-4000-8000-000000000005', 'Martina', 5, 'Para el oral de Anatomía fue clave. Usa láminas y esquemas.', 'approved', 5),
  ('00000000-0000-4000-8000-000000000007', 'Laura', 5, 'Mi hija de 3º año levantó la nota de Matemática. Súper paciente.', 'approved', 4),
  ('00000000-0000-4000-8000-000000000009', 'Pilar', 5, 'Estequiometría por fin tiene sentido.', 'approved', 2),
  ('00000000-0000-4000-8000-000000000012', 'Santi', 4, 'Muy buena con Análisis, va a tu ritmo.', 'pending', 0)
) as t(id, author, rating, comment, status, days);

-- Materia escrita a mano por el profe pendiente, para mostrar "Materias pedidas" en el admin.
insert into subject_requests (teacher_id, name)
values ('00000000-0000-4000-8000-000000000013', 'Estadística II – Económicas');
