import { handle } from "@hono/node-server/vercel";
import type { IncomingMessage, ServerResponse } from "node:http";

import app from "../server/src/app";

/**
 * Punto de entrada de Vercel: una sola funcion para toda la API, con Hono
 * enrutando por dentro. Un fichero por endpoint habria superado el limite de
 * funciones del plan gratuito y multiplicado los arranques en frio.
 *
 * El enrutado no se delega en los nombres de fichero. La version anterior usaba
 * `api/[...route].ts` confiando en que Vercel lo tratase como comodin, y en el
 * despliegue resulto comportarse como un parametro de un solo segmento:
 * `/api/health` llegaba pero `/api/market/tokens` devolvia 404. Ahora la
 * reescritura de `vercel.json` manda todo `/api/*` aqui y pasa la ruta original
 * en `__path`, que es una captura explicita y no depende de como interprete
 * Vercel los corchetes.
 *
 * Se usa el runtime de Node (no Edge) porque el hash de contrasenas usa
 * `node:crypto.scrypt`.
 */
export const config = {
  runtime: "nodejs",
};

const honoHandler = handle(app);

/** Devuelve la URL que Hono debe ver, a partir de lo que envia la reescritura. */
export function restoreOriginalUrl(rawUrl: string): string {
  const url = new URL(rawUrl, "http://localhost");
  const original = url.searchParams.get("__path");

  // Sin `__path` la peticion llego directa: se deja tal cual.
  if (original === null) return rawUrl;

  url.searchParams.delete("__path");
  const query = url.searchParams.toString();
  const path = original.replace(/^\/+/, "");

  return `/api${path ? `/${path}` : ""}${query ? `?${query}` : ""}`;
}

export default function handler(
  req: IncomingMessage,
  res: ServerResponse,
): unknown {
  if (req.url) req.url = restoreOriginalUrl(req.url);
  return honoHandler(req, res);
}
