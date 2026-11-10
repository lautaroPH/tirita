"use client";

import { useState, useTransition } from "react";
import { deleteMyProfile } from "./actions";

export function DeleteProfile() {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="btn-secondary">
        Borrar mi perfil
      </button>
    );
  }
  return (
    <div className="space-y-3 rounded border-[1.5px] border-ink p-4">
      <p className="font-semibold">¿Borrar tu perfil para siempre?</p>
      <p className="text-sm text-g4">
        Se borran tus datos, tus materias, tu foto y tus reseñas. No se puede deshacer. Si solo querés dejar de
        recibir alumnos por un tiempo, mejor pausalo.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => deleteMyProfile())}
          className="btn-primary"
        >
          {pending ? "Borrando…" : "Sí, borrar todo"}
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </div>
  );
}
