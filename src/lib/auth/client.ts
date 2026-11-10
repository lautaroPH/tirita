"use client";

import { createAuthClient } from "@neon/auth/next";

// Habla con /api/auth del mismo sitio; no lleva configuración.
export const authClient = createAuthClient();
