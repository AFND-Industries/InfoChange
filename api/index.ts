import { handle } from "@hono/node-server/vercel";
import type { IncomingMessage, ServerResponse } from "node:http";

/**
 * Punto de entrada de Vercel: una sola funcion para toda la API, con Hono
 * enrutando por dentro. Un fichero por endpoint habria superado el limite de
 * funciones del plan gratuito y multiplicado los arranques en frio.
 *
 * El enrutado no se delega en los nombres de fichero. Una version anterior usaba
 * `api/[...route].ts` confiando en que Vercel lo tratase como comodin, y en el
 * despliegue resulto comportarse como un parametro de un solo segmento:
 * `/api/health` llegaba pero `/api/market/tokens` devolvia 404. Ahora la
 * reescritura de `vercel.json` manda todo `/api/*` aqui y pasa la ruta original
 * en `__path`, una captura explicita que no depende de como interprete Vercel
 * los corchetes.
 *
 * Se usa el runtime de Node (no Edge) porque el hash de contrasenas usa
 * `node:crypto.scrypt`.
 */
export const config = {
  runtime: "nodejs",
};

/**
 * La aplicacion se carga de forma diferida para poder capturar un fallo de
 * arranque. Si se importase arriba, cualquier error al cargar el modulo saldria
 * como un `FUNCTION_INVOCATION_FAILED` opaco, sin forma de saber la causa desde
 * fuera; asi se responde con el motivo y la version del runtime.
 */
let aplicacion: Promise<ReturnType<typeof handle>> | undefined;

function cargarAplicacion(): Promise<ReturnType<typeof handle>> {
  aplicacion ??= import("../server/src/app.js").then((modulo) => handle(modulo.default));
  return aplicacion;
}

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

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<unknown> {
  if (req.url) req.url = restoreOriginalUrl(req.url);

  let honoHandler;
  try {
    honoHandler = await cargarAplicacion();
  } catch (error) {
    // Solo se llega aqui si la aplicacion no consigue arrancar. El mensaje es
    // siempre uno propio (configuracion o runtime), nunca una traza.
    console.error("[infochange] la aplicacion no ha podido arrancar", error);

    res.statusCode = 500;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify({
        error: {
          code: "STARTUP_ERROR",
          message:
            error instanceof Error ? error.message : "La API no ha podido arrancar.",
        },
        runtime: process.version,
      }),
    );
    return undefined;
  }

  return honoHandler(req, res);
}
