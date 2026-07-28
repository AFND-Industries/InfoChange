import { handle } from "hono/vercel";

/**
 * Punto de entrada de Vercel: una sola funcion para toda la API, con Hono
 * enrutando por dentro. Un fichero por endpoint habria superado el limite de
 * funciones del plan gratuito y multiplicado los arranques en frio.
 *
 * Se usa el adaptador `hono/vercel`, que es un manejador Web estandar
 * (`Request` -> `Response`), y no `@hono/node-server/vercel`, que trabaja sobre
 * los objetos de Node. Con este ultimo, en Vercel las peticiones GET
 * funcionaban y las POST se quedaban colgadas hasta agotar la invocacion, sin
 * llegar a ejecutar la ruta. En local no se reproducia.
 *
 * El enrutado tampoco se delega en los nombres de fichero. Una version anterior
 * usaba `api/[...route].ts` confiando en que Vercel lo tratase como comodin, y
 * resulto comportarse como un parametro de un solo segmento: `/api/health`
 * llegaba pero `/api/market/tokens` devolvia 404. La reescritura de
 * `vercel.json` manda todo `/api/*` aqui pasando la ruta original en `__path`.
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
let aplicacion: Promise<(request: Request) => Response | Promise<Response>> | undefined;

function cargarAplicacion() {
  aplicacion ??= import("../server/src/app.js").then((modulo) => handle(modulo.default));
  return aplicacion;
}

/** Devuelve la URL que Hono debe ver, a partir de lo que envia la reescritura. */
export function restoreOriginalUrl(rawUrl: string): string {
  const esAbsoluta = /^https?:\/\//i.test(rawUrl);
  const url = new URL(rawUrl, "http://localhost");
  const original = url.searchParams.get("__path");

  // Sin `__path` la peticion llego directa: se deja tal cual.
  if (original === null) return rawUrl;

  url.searchParams.delete("__path");
  const path = original.replace(/^\/+/, "");
  url.pathname = `/api${path ? `/${path}` : ""}`;

  return esAbsoluta ? url.toString() : `${url.pathname}${url.search}`;
}

export default async function handler(request: Request): Promise<Response> {
  const destino = restoreOriginalUrl(request.url);

  let peticion = request;
  if (destino !== request.url) {
    /**
     * El cuerpo se lee entero antes de reconstruir la peticion. Reenviarlo como
     * flujo obligaria a `duplex: "half"` y a que todas las capas lo respeten;
     * aqui son objetos JSON pequenos, asi que no compensa el riesgo.
     */
    const cuerpo =
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer();

    peticion = new Request(destino, {
      method: request.method,
      headers: request.headers,
      body: cuerpo,
    });
  }

  try {
    const aplicacionHono = await cargarAplicacion();
    return await aplicacionHono(peticion);
  } catch (error) {
    // Solo se llega aqui si la aplicacion no consigue arrancar. El mensaje es
    // siempre uno propio (configuracion o runtime), nunca una traza.
    console.error("[infochange] la aplicacion no ha podido arrancar", error);

    return new Response(
      JSON.stringify({
        error: {
          code: "STARTUP_ERROR",
          message:
            error instanceof Error ? error.message : "La API no ha podido arrancar.",
        },
        runtime: process.version,
      }),
      { status: 500, headers: { "content-type": "application/json; charset=utf-8" } },
    );
  }
}
