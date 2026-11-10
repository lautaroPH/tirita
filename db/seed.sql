-- Materias, con los nombres oficiales de los planes de estudio de la UNLP
-- (verificados en noviembre 2026 en las páginas de cada facultad).
-- Se puede correr varias veces: corrige nombres y agrega lo que falte.

-- Correcciones de nombres de la primera versión.
update subjects set name = 'Conceptos de Algoritmos, Datos y Programas (CADP)'
  where slug = 'cadp-informatica';
update subjects set name = 'Contabilidad I (Bases y Fundamentos)'
  where slug = 'contabilidad-i-economicas';

insert into subjects (slug, name, level, area, sort) values
  -- Ingeniería (Plan 2018, ciclo básico)
  ('matematica-para-ingenieria', 'Matemática para Ingeniería (nivelación)', 'universidad', 'Ingeniería', 9),
  ('matematica-a-ingenieria', 'Matemática A', 'universidad', 'Ingeniería', 10),
  ('matematica-b-ingenieria', 'Matemática B', 'universidad', 'Ingeniería', 11),
  ('matematica-c-ingenieria', 'Matemática C', 'universidad', 'Ingeniería', 12),
  ('fisica-i-ingenieria', 'Física I', 'universidad', 'Ingeniería', 13),
  ('fisica-ii-ingenieria', 'Física II', 'universidad', 'Ingeniería', 14),
  ('quimica-ingenieria', 'Química', 'universidad', 'Ingeniería', 15),
  ('quimica-para-ingenieria', 'Química para Ingeniería', 'universidad', 'Ingeniería', 16),
  ('probabilidades-estadistica-ingenieria', 'Probabilidades y Estadística', 'universidad', 'Ingeniería', 17),
  ('representacion-grafica-ingenieria', 'Representación Gráfica', 'universidad', 'Ingeniería', 18),
  -- Ciencias Exactas (Lic. en Matemática Plan 2019, Bioquímica Plan 2010)
  ('analisis-i-exactas', 'Análisis Matemático I', 'universidad', 'Exactas', 20),
  ('analisis-ii-exactas', 'Análisis Matemático II', 'universidad', 'Exactas', 21),
  ('algebra-exactas', 'Álgebra', 'universidad', 'Exactas', 22),
  ('algebra-calculo-numerico-exactas', 'Álgebra, Cálculo Numérico y Geometría Analítica', 'universidad', 'Exactas', 23),
  ('algebra-lineal-exactas', 'Álgebra Lineal', 'universidad', 'Exactas', 24),
  ('introduccion-quimica-exactas', 'Introducción a la Química', 'universidad', 'Exactas', 25),
  ('quimica-general-exactas', 'Química General', 'universidad', 'Exactas', 26),
  ('fisica-i-exactas', 'Física I', 'universidad', 'Exactas', 27),
  -- Informática (Lic. en Informática Plan 2015)
  ('matematica-0-informatica', 'Matemática 0 (ingreso)', 'universidad', 'Informática', 29),
  ('expresion-problemas-informatica', 'Expresión de Problemas y Algoritmos (ingreso)', 'universidad', 'Informática', 30),
  ('matematica-1-informatica', 'Matemática 1', 'universidad', 'Informática', 31),
  ('matematica-2-informatica', 'Matemática 2', 'universidad', 'Informática', 32),
  ('cadp-informatica', 'Conceptos de Algoritmos, Datos y Programas (CADP)', 'universidad', 'Informática', 33),
  ('taller-programacion-informatica', 'Taller de Programación', 'universidad', 'Informática', 34),
  ('organizacion-computadoras-informatica', 'Organización de Computadoras', 'universidad', 'Informática', 35),
  ('arquitectura-computadoras-informatica', 'Arquitectura de Computadoras', 'universidad', 'Informática', 36),
  -- Ciencias Económicas (Contador Plan VII, Economía y Administración Plan VIII)
  ('matematica-i-economicas', 'Matemática I', 'universidad', 'Económicas', 40),
  ('matematica-ii-economicas', 'Matemática II', 'universidad', 'Económicas', 41),
  ('matematica-administradores-economicas', 'Matemática para Administradores', 'universidad', 'Económicas', 42),
  ('matematica-economistas-i-economicas', 'Matemática para Economistas I', 'universidad', 'Económicas', 43),
  ('contabilidad-i-economicas', 'Contabilidad I (Bases y Fundamentos)', 'universidad', 'Económicas', 44),
  ('contabilidad-ii-economicas', 'Contabilidad II (Ajuste y Valuación)', 'universidad', 'Económicas', 45),
  ('microeconomia-i-economicas', 'Microeconomía I', 'universidad', 'Económicas', 46),
  ('estadistica-aplicada-economicas', 'Estadística Aplicada', 'universidad', 'Económicas', 47),
  -- Ciencias Médicas (Medicina)
  ('anatomia-medicina', 'Anatomía', 'universidad', 'Medicina', 50),
  ('biologia-medicina', 'Biología', 'universidad', 'Medicina', 51),
  ('citologia-histologia-medicina', 'Citología, Histología y Embriología', 'universidad', 'Medicina', 52),
  ('ciencias-exactas-medicina', 'Ciencias Exactas', 'universidad', 'Medicina', 53),
  ('bioquimica-biologia-molecular-medicina', 'Bioquímica y Biología Molecular', 'universidad', 'Medicina', 54),
  ('fisiologia-fisica-biologica-medicina', 'Fisiología y Física Biológica', 'universidad', 'Medicina', 55),
  -- Ciencias Jurídicas y Sociales (Abogacía, Plan 6)
  ('introduccion-derecho', 'Introducción al Derecho', 'universidad', 'Derecho', 60),
  ('derecho-romano', 'Derecho Romano', 'universidad', 'Derecho', 61),
  ('historia-constitucional-derecho', 'Historia Constitucional', 'universidad', 'Derecho', 62),
  ('derecho-politico', 'Derecho Político', 'universidad', 'Derecho', 63),
  ('introduccion-sociologia-derecho', 'Introducción a la Sociología', 'universidad', 'Derecho', 64),
  -- Arquitectura y Urbanismo (Plan VI)
  ('elementos-matematica-fisica-arquitectura', 'Elementos de Matemática y Física', 'universidad', 'Arquitectura', 70),
  ('sistemas-representacion-arquitectura', 'Sistemas de Representación', 'universidad', 'Arquitectura', 71),
  ('matematica-aplicada-arquitectura', 'Matemática Aplicada', 'universidad', 'Arquitectura', 72),
  ('estructuras-i-arquitectura', 'Estructuras I', 'universidad', 'Arquitectura', 73),
  -- Ciencias Naturales y Museo
  ('matematica-naturales', 'Matemática', 'universidad', 'Naturales', 80),
  ('quimica-general-naturales', 'Química General', 'universidad', 'Naturales', 81),
  ('fisica-general-naturales', 'Física General', 'universidad', 'Naturales', 82),
  ('estadistica-naturales', 'Estadística', 'universidad', 'Naturales', 83),
  -- Humanidades (profesorados de Matemática y Física)
  ('logica-humanidades', 'Lógica', 'universidad', 'Humanidades', 90),
  ('geometria-analitica-humanidades', 'Geometría Analítica', 'universidad', 'Humanidades', 91),
  -- Secundaria
  ('matematica-secundaria', 'Matemática', 'secundaria', null, 100),
  ('fisica-secundaria', 'Física', 'secundaria', null, 101),
  ('quimica-secundaria', 'Química', 'secundaria', null, 102),
  ('ingles-secundaria', 'Inglés', 'secundaria', null, 103),
  ('biologia-secundaria', 'Biología', 'secundaria', null, 104),
  ('lengua-literatura-secundaria', 'Lengua y Literatura', 'secundaria', null, 105),
  ('historia-secundaria', 'Historia', 'secundaria', null, 106),
  ('geografia-secundaria', 'Geografía', 'secundaria', null, 107),
  ('contabilidad-secundaria', 'Contabilidad', 'secundaria', null, 108)
on conflict (slug) do update set sort = excluded.sort;
