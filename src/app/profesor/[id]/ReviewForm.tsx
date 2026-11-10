"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useState } from "react";
import { FormError } from "@/components/Icons";
import { authClient } from "@/lib/auth/client";
import { submitReview, type ReviewState } from "./actions";

type Props = {
  teacherId: string;
  student: { name: string } | null;
  loginEnabled: boolean;
};

export function ReviewForm({ teacherId, student, loginEnabled }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [state, action, pending] = useActionState<ReviewState, FormData>(submitReview, null);

  if (state?.ok) {
    return (
      <p role="status" className="rounded border-[1.5px] border-g3 bg-[var(--highlight)] px-4 py-3 font-medium">
        {state.message}
      </p>
    );
  }

  // Sin sesión: para reseñar hay que entrar con Google (evita spam y reseñas falsas).
  if (!student) {
    if (!loginEnabled) {
      return <p className="text-sm text-g4">Muy pronto vas a poder dejar tu reseña entrando con Google.</p>;
    }
    return (
      <div className="space-y-2">
        <button
          type="button"
          disabled={signingIn}
          onClick={async () => {
            setSigningIn(true);
            setLoginError(null);
            const { error } = await authClient.signIn.social({
              provider: "google",
              callbackURL: window.location.href,
            });
            if (error) {
              setLoginError("No pudimos abrir el login de Google. Probá de nuevo.");
              setSigningIn(false);
            }
          }}
          className="btn-secondary"
        >
          {signingIn ? "Abriendo Google…" : "Tomé clase: entrar con Google para reseñar"}
        </button>
        <p className="text-sm text-g4">
          Pedimos login solo para reseñar, así cada reseña es de una persona real. Se publica solo tu primer nombre.
        </p>
        {loginError && <FormError>{loginError}</FormError>}
      </div>
    );
  }

  const first = student.name.split(/\s+/)[0];

  if (!open) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setOpen(true)} className="btn-secondary">
          Tomé clase: dejar reseña
        </button>
        <SignOut onDone={() => router.refresh()} />
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      className="space-y-3 rounded border border-g2 p-4"
    >
      <input type="hidden" name="teacherId" value={teacherId} />
      <p className="text-sm text-g4">
        Publicás como <span className="font-semibold text-ink">{first}</span>.
      </p>
      <label className="block max-w-40 space-y-1">
        <span className="text-sm font-semibold">Puntaje</span>
        <select name="rating" defaultValue="5" className="field-select">
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} de 5
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-semibold">Comentario (opcional)</span>
        <textarea name="comment" rows={3} maxLength={800} className="field" placeholder="¿Cómo te fue con la clase?" />
      </label>
      {state && !state.ok && <FormError>{state.message}</FormError>}
      <div className="flex gap-2">
        <button disabled={pending} className="btn-primary">
          {pending ? "Enviando…" : "Enviar reseña"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
          Cancelar
        </button>
      </div>
      <p className="text-sm text-g4">La revisamos antes de publicarla. Podés dejar una sola reseña por profe.</p>
    </form>
  );
}

function SignOut({ onDone }: { onDone: () => void }) {
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        onDone();
      }}
      className="text-sm text-g4 underline hover:text-ink"
    >
      Salir de mi cuenta
    </button>
  );
}
