-- Borra todos los profes de ejemplo (y por cascada sus materias, reseñas, fotos y pedidos).
delete from teachers where email like '%@demo.invalid';
