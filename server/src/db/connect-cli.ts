import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Antes que nada, para que `env()` vea lo que hay en el fichero .env.
import "../load-env";
import { env } from "../env.js";
import type { Database } from "./client.js";
import * as schema from "./schema.js";

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
  const isLocal = /@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(connectionString);

  const pool = new Pool({
    connectionString,
    /**
     * Con TLS y verificando el certificado. Neon, y cualquier proveedor
     * gestionado serio, presenta un certificado emitido por una CA publica, asi
     * que no hace falta relajar la comprobacion: hacerlo dejaria la conexion
     * expuesta a un intermediario justo cuando viaja la contrasena de la base de
     * datos. Un Postgres local normalmente no ofrece TLS.
     */
    ssl: isLocal ? false : true,
  });

  try {
    return await run(drizzle(pool, { schema }));
  } finally {
    await pool.end();
  }
}
