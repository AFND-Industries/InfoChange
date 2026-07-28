import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import ws from "ws";

import { env } from "../env";

neonConfig.webSocketConstructor = globalThis.WebSocket ?? ws;

const pool = new Pool({ connectionString: env().DATABASE_URL });

try {
  await migrate(drizzle(pool), { migrationsFolder: "./drizzle" });
  console.log("Migraciones aplicadas.");
} finally {
  await pool.end();
}
