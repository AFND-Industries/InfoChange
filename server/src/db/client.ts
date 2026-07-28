import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import ws from "ws";

import { env } from "../env";
import * as schema from "./schema";

export type Database = NeonDatabase<typeof schema>;

/**
 * El driver serverless de Neon habla por WebSocket, que es lo que permite
 * abrir transacciones reales desde una funcion sin estado. Node 22 ya trae
 * `WebSocket` global, pero fijarlo explicitamente evita depender de la version
 * concreta del runtime.
 */
neonConfig.webSocketConstructor = globalThis.WebSocket ?? ws;

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
