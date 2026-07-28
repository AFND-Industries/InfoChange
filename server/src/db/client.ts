import { neonConfig, Pool } from "@neondatabase/serverless";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

import { env } from "../env";
import * as schema from "./schema";

/**
 * Tipo independiente del driver. El proyecto usa tres:
 * el serverless de Neon en produccion, `pg` por TCP en los scripts de linea de
 * comandos y PGlite en los tests. La API de consulta es identica en los tres, y
 * escribirlo asi evita tener que forzar conversiones de tipo al pasar de uno a
 * otro.
 */
export type Database = PgDatabase<
  PgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

/**
 * El driver serverless de Neon habla por WebSocket, que es lo que permite abrir
 * transacciones reales desde una funcion sin estado.
 *
 * Se usa el `WebSocket` nativo de Node y no el paquete `ws` a proposito: `ws` es
 * CommonJS y hace `require()` por dentro, asi que al empaquetar la funcion como
 * ESM reventaba nada mas cargar el modulo con "Dynamic require of events is not
 * supported", antes incluso de atender la peticion.
 *
 * `WebSocket` es global desde Node 22, que es lo que exige `engines`.
 */
if (typeof globalThis.WebSocket !== "function") {
  throw new Error(
    "Se necesita Node 22 o superior: el driver de Neon usa el WebSocket nativo.",
  );
}

neonConfig.webSocketConstructor = globalThis.WebSocket;

let cached: Database | undefined;

function create(): Database {
  const pool = new Pool({ connectionString: env().DATABASE_URL });
  return drizzle(pool, { schema });
}

/**
 * Se cachea a nivel de modulo para reaprovechar la conexion entre invocaciones
 * calientes de la misma instancia serverless.
 */
export function getDatabase(): Database {
  cached ??= create();
  return cached;
}

/** Punto de inyeccion para los tests, que corren sobre PGlite en memoria. */
export function setDatabase(database: Database | undefined): void {
  cached = database;
}

export { schema };
