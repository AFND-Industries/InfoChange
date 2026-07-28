import { defineConfig } from "drizzle-kit";

/**
 * El esquema vivia solo dentro de los modelos de Sequelize y no habia ni un
 * fichero de migracion: la base de datos de produccion habia que crearla a
 * mano. Ahora `npm run db:generate` deriva el SQL del esquema y queda versionado
 * en `drizzle/`.
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
});
