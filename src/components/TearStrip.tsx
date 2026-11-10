import { WhatsappIcon } from "./Icons";

/**
 * La fila de tiritas que cuelga del aviso: tiras separadas (se ve la hoja cuadriculada entre
 * ellas). La primera, más ancha, es el link a WhatsApp; el resto llevan el nombre.
 */
export function TearStrip({ name, href, label }: { name: string; href: string; label: string }) {
  return (
    <a href={href} rel="nofollow" className="tear-strip flex gap-[3px] focus-visible:outline-offset-4">
      <span className="tear-tab tab flex min-h-16 flex-[3] items-center justify-center gap-2 whitespace-nowrap px-3 font-semibold text-pen">
        <WhatsappIcon size={20} />
        {label}
      </span>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden
          className={`tab hand min-h-16 w-11 shrink-0 items-center justify-center text-[15px] font-normal text-g4 [writing-mode:vertical-rl] ${
            i === 2 ? "hidden sm:flex" : "flex"
          }`}
        >
          {name}
        </span>
      ))}
    </a>
  );
}
