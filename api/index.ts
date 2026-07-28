import type { IncomingMessage, ServerResponse } from "node:http";

/**
 * Punto de entrada de Vercel: una sola funcion para toda la API, con Hono
 * enrutando por dentro. Un fichero por endpoint habria superado el limite de
 * funciones del plan gratuito y multiplicado los arranques en frio.
 *
 * La conversion entre los objetos de Node que entrega Vercel y la `Request` Web
 * que consume Hono se hace aqui, a mano, en lugar de delegarla en un adaptador.
 * Se probaron los dos disponibles y ninguno sirve en este runtime:
 *
 *   - `@hono/node-server/vercel`: las peticiones GET funcionaban y las POST se
 *     quedaban colgadas hasta agotar la invocacion, sin ejecutar la ruta.
 *   - `hono/vercel`: espera la firma Web (`Request` -> `Response`), pero Vercel
 *     invoca la funcion con `(req, res)`, asi que fallaba todo.
 *
 * Son treinta lineas y a cambio el comportamiento es el mismo aqui, en local y
 * en la comprobacion de despliegue.
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

type Fetch = (request: Request) => Response | Promise<Response>;

/**
 * La aplicacion se carga de forma diferida para poder capturar un fallo de
 * arranque. Si se importase arriba, cualquier error al cargar el modulo saldria
 * como un `FUNCTION_INVOCATION_FAILED` opaco, sin forma de saber la causa desde
 * fuera; asi se responde con el motivo y la version del runtime.
 */
let aplicacion: Promise<Fetch> | undefined;

function cargarAplicacion(): Promise<Fetch> {
  aplicacion ??= import("../server/src/app.js").then(
    (modulo) => modulo.default.fetch as Fetch,
  );
  return aplicacion;
}

/** Devuelve la ruta que Hono debe ver, a partir de lo que envia la reescritura. */
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

/**
 * Vuelca el cuerpo de la peticion. Aqui son siempre objetos JSON pequenos, asi
 * que no compensa reenviarlo como flujo: hacerlo obligaria a `duplex: "half"` y
 * a que todas las capas lo respeten.
 *
 * Se devuelve `Uint8Array` y no `Buffer` porque es lo que acepta `BodyInit` sin
 * depender de los tipos de Node.
 */
async function leerCuerpo(req: IncomingMessage): Promise<Uint8Array<ArrayBuffer> | undefined> {
  if (req.method === "GET" || req.method === "HEAD") return undefined;

  const trozos: Buffer[] = [];
  for await (const trozo of req) {
    trozos.push(typeof trozo === "string" ? Buffer.from(trozo) : trozo);
  }

  if (trozos.length === 0) return undefined;

  // Se copia a un `ArrayBuffer` propio: una vista sobre el buffer de Node
  // arrastra el tipo `ArrayBufferLike`, que no vale como cuerpo de `Request`.
  const unido = Buffer.concat(trozos);
  const copia = new Uint8Array(unido.byteLength);
  copia.set(unido);

  return copia;
}

export function construirPeticion(
  req: IncomingMessage,
  cuerpo: Uint8Array<ArrayBuffer> | undefined,
): Request {
  const protocolo =
    (req.headers["x-forwarded-proto"] as string | undefined)?.split(",")[0] ?? "https";
  const host = (req.headers["x-forwarded-host"] as string | undefined) ?? req.headers.host;
  const ruta = restoreOriginalUrl(req.url ?? "/");

  const cabeceras = new Headers();
  for (const [nombre, valor] of Object.entries(req.headers)) {
    if (valor === undefined) continue;
    // `set-cookie` es la unica cabecera que llega repetida.
    for (const uno of Array.isArray(valor) ? valor : [valor]) {
      cabeceras.append(nombre, uno);
    }
  }

  return new Request(new URL(ruta, `${protocolo}://${host ?? "localhost"}`), {
    method: req.method ?? "GET",
    headers: cabeceras,
    body: cuerpo,
  });
}

async function volcarRespuesta(
  respuesta: Response,
  res: ServerResponse,
): Promise<void> {
  res.statusCode = respuesta.status;

  respuesta.headers.forEach((valor, nombre) => {
    if (nombre.toLowerCase() !== "set-cookie") res.setHeader(nombre, valor);
  });

  // Las cookies pueden ser varias y hay que enviarlas como cabeceras separadas.
  const cookies = respuesta.headers.getSetCookie();
  if (cookies.length > 0) res.setHeader("set-cookie", cookies);

  const cuerpo = respuesta.body ? Buffer.from(await respuesta.arrayBuffer()) : undefined;
  res.end(cuerpo);
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  try {
    const cuerpo = await leerCuerpo(req);
    const fetchAplicacion = await cargarAplicacion();
    const respuesta = await fetchAplicacion(construirPeticion(req, cuerpo));

    await volcarRespuesta(respuesta, res);
  } catch (error) {
    // Solo se llega aqui si la aplicacion no consigue arrancar o la conversion
    // falla. El mensaje es siempre uno propio, nunca una traza.
    console.error("[infochange] la funcion no ha podido responder", error);

    res.statusCode = 500;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify({
        error: {
          code: "STARTUP_ERROR",
          message:
            error instanceof Error ? error.message : "La API no ha podido responder.",
        },
        runtime: process.version,
      }),
    );
  }
}
