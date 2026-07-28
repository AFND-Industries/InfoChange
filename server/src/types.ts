import type { Database } from "./db/client";
import type { User } from "./db/schema";
import type { SessionClaims } from "./lib/session";

export interface AppEnv {
  Variables: {
    db: Database;
    /** Reclamaciones del token, o `null` si la peticion es anonima. */
    session: SessionClaims | null;
    /** Solo lo rellena `requireAuth`; en rutas publicas no existe. */
    user: User;
  };
}
