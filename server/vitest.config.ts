import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    setupFiles: ["./tests/setup.ts"],
    // PGlite arranca un Postgres en WebAssembly por fichero de test; el arranque
    // en frio se lleva unos segundos.
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
