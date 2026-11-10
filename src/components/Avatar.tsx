import Image from "next/image";

/**
 * Foto cuadrada a tamaño fijo. Sin foto no se muestra nada: un aviso de
 * cartelera no lleva un recuadro de iniciales, el nombre ocupa todo el ancho.
 */
export function Avatar({ name, src, size }: { name: string; src: string | null; size: number }) {
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      // Las fotos ya se guardan achicadas (480 px, WebP); no hace falta optimizarlas de nuevo.
      unoptimized
      className="shrink-0 object-cover"
      style={{ width: size, height: size }}
    />
  );
}
