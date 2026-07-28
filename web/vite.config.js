import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const API_PORT = process.env.API_PORT ?? "3003";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  /**
   * En desarrollo la API se sirve bajo el mismo origen que el frontend, igual
   * que en Vercel. Asi la cookie de sesion se comporta identico en local y en
   * produccion, y no hace falta ni CORS ni una URL de servidor configurable.
   */
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: `http://localhost:${API_PORT}`,
        changeOrigin: true,
      },
    },
  },
  // `vite preview` sirve el build de produccion; con el mismo proxy se puede
  // comprobar en local exactamente lo que se va a desplegar.
  preview: {
    port: 4173,
    proxy: {
      "/api": {
        target: `http://localhost:${API_PORT}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    target: "es2020",
    sourcemap: true,
    rollupOptions: {
      output: {
        /**
         * Se separan las librerias grandes para que publicar una version nueva
         * de la aplicacion no invalide su cache. Antes todo iba en un unico
         * bundle de 3,7 MB, en buena parte por los 6,7 MB de JSON que se
         * importaban de forma estatica.
         */
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          bootstrap: ["react-bootstrap", "react-bootstrap-icons"],
          query: ["@tanstack/react-query"],
        },
      },
    },
  },
});
