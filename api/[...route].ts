import { handle } from "@hono/node-server/vercel";

import app from "../server/src/app";

/**
 * Punto de entrada de Vercel. El nombre `[...route]` es la ruta comodin nativa
 * de Vercel: cualquier peticion a `/api/...` llega aqui con su URL original
 * intacta y Hono se encarga del enrutado, sin necesidad de reescrituras.
 *
 * Se usa el runtime de Node (no Edge) porque el hash de contrasenas usa
 * `node:crypto.scrypt`.
 */
export const config = {
  runtime: "nodejs",
};

export default handle(app);
