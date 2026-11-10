import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Permite subir la foto del profe (hasta 6 MB, se achica al guardarla) desde el formulario.
    serverActions: { bodySizeLimit: "7mb" },
  },
};

export default nextConfig;
