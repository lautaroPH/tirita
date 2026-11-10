"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";

export function SignOutButton({
  redirectTo = "/",
  label = "Salir",
  className = "btn-secondary",
}: {
  redirectTo?: string;
  label?: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await authClient.signOut();
        window.location.assign(redirectTo);
      }}
      className={className}
    >
      {busy ? "Saliendo…" : label}
    </button>
  );
}
