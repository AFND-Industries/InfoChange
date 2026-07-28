import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "../env";
import type { Database } from "./client";
import * as schema from "./schema";

/**
 * Conexion para los scripts de linea de comandos (migraciones y datos
 * iniciales).
 *
 * Usa el driver estandar de Postgres por TCP en vez del driver serverless por
 * WebSocket que emplea la API. Para un proceso de un solo uso no aporta nada
 * abrir un WebSocket, y en cambio asi los scripts funcionan contra cualquier
 * Postgres -- Neon, uno en Docker o el de otro proveedor -- y no dependen del
 * proxy de Neon, que algunas redes bloquean.
 */
export async function withCliDatabase<T>(
  run: (db: Database) => Promise<T>,
): Promise<T> {
  const connectionString = env().DATABASE_URL;
  const pool = new Pool({
    connectionString,
    // Neon y la mayoria de proveedores gestionados exigen TLS; un Postgres
    // local normalmente no lo ofrece.
    ssl: /localhost|127\.0\.0\.1/.test(connectionString)
      ? false
      : { rejectUnauthorized: false },
  });

  try {
    return await run(drizzle(pool, { schema }));
  } finally {
    await pool.end();
  }
}
