"use client";

import { startTransition, useActionState } from "react";
import { FormError } from "@/components/Icons";
import { sendRemovalRequest, type BajaState } from "./actions";

export function BajaForm() {
  const [state, action, pending] = useActionState<BajaState, FormData>(sendRemovalRequest, null);

  if (state?.ok) {
    return (
      <p role="status" className="rounded border-[1.5px] border-g3 bg-[var(--highlight)] px-4 py-4 text-lg font-medium">
        {state.message}
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      className="space-y-4"
    >
      <label className="block space-y-1.5">
        <span className="font-semibold">Qué necesitás</span>
        <select name="type" required defaultValue="" className="field-select">
          <option value="" disabled>
            Elegí
          </option>
          <option value="perfil">Borrar mi perfil de profe</option>
          <option value="resena">Borrar una reseña</option>
          <option value="corregir">Corregir datos</option>
          <option value="otro">Otro</option>
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="font-semibold">Tu nombre</span>
          <input name="name" required maxLength={80} className="field" autoComplete="name" />
        </label>
        <label className="block space-y-1.5">
          <span className="font-semibold">Email o WhatsApp para responderte</span>
          <input name="contact" required maxLength={120} className="field" />
        </label>
      </div>
      <label className="block space-y-1.5">
        <span className="font-semibold">Contanos qué pasa</span>
        <textarea
          name="message"
          required
          rows={4}
          maxLength={1500}
          className="field"
          placeholder="Qué perfil o reseña es (nombre del profe), y qué querés borrar o corregir."
        />
      </label>
      {/* Campo trampa contra bots: oculto para personas y lectores de pantalla. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          No completar
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state && !state.ok && <FormError>{state.message}</FormError>}
      <button disabled={pending} className="btn-primary w-full sm:w-auto">
        {pending ? "Enviando…" : "Enviar pedido"}
      </button>
    </form>
  );
}
