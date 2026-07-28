import type { Database } from "./db/client.js";
import type { User } from "./db/schema.js";
import type { SessionClaims } from "./lib/session.js";

export interface AppEnv {
  Variables: {
    db: Database;
    /** Reclamaciones del token, o `null` si la peticion es anonima. */
    session: SessionClaims | null;
    /** Solo lo rellena `requireAuth`; en rutas publicas no existe. */
    user: User;
  };
}
