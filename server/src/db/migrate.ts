import { migrate } from "drizzle-orm/node-postgres/migrator";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { withCliDatabase } from "./connect-cli";

// El migrador es especifico del driver, asi que aqui si hace falta concretar.

/**
 * Aplica las migraciones pendientes. Es idempotente: Drizzle lleva la cuenta de
 * las ya aplicadas en su propia tabla, asi que se puede ejecutar tantas veces
 * como haga falta.
 */
await withCliDatabase(async (db) => {
  await migrate(db as unknown as NodePgDatabase, { migrationsFolder: "./drizzle" });
  console.log("Migraciones aplicadas.");
});
