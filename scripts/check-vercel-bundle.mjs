/**
 * Comprueba que la funcion de Vercel se empaqueta, arranca y enruta bien.
 *
 * Existe por dos fallos reales que solo aparecieron ya desplegado, porque
 * ningun otro paso (typecheck, lint, tests, build) llega a ejecutar el
 * artefacto que se sube:
 *
 *   1. El paquete `ws` es CommonJS y hace `require()` por dentro, asi que al
 *      empaquetar como ESM la funcion reventaba al cargar el modulo:
 *      FUNCTION_INVOCATION_FAILED en todas las rutas.
 *   2. `api/[...route].ts` no se comportaba como comodin en Vercel, sino como
 *      un parametro de un solo segmento: `/api/health` funcionaba y
 *      `/api/market/tokens` devolvia 404.
 *
 * Por eso aqui se prueban rutas de uno y de varios segmentos, y la forma
 * reescrita (`?__path=`) que es la que llega de verdad en produccion.
 *
 * No necesita base de datos: se usan rutas que responden sin tocarla.
 */
import { execFileSync } from "node:child_process";
import { IncomingMessage, ServerResponse } from "node:http";
import { mkdtempSync, rmSync } from "node:fs";
import { Socket } from "node:net";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(fileURLToPath(import.meta.url), "../..");
const salida = mkdtempSync(join(tmpdir(), "infochange-bundle-"));
const bundle = join(salida, "function.mjs");

// Valores de relleno: no se abre ninguna conexion (el pool es perezoso), pero
// la aplicacion exige que la configuracion sea valida para arrancar.
process.env.NODE_ENV = "production";
process.env.DATABASE_URL ??= "postgresql://comprobacion:comprobacion@localhost:5432/comprobacion";
process.env.SESSION_SECRET ??= "clave-de-comprobacion-suficientemente-larga-0";

/** Reescrituras que aplica Vercel, comprobadas sobre la funcion real. */
const RUTAS = [
  ["/api?__path=health", "/api/health"],
  ["/api?__path=market/tokens", "/api/market/tokens"],
  ["/api?__path=market/prices&symbol=BTCUSDT", "/api/market/prices?symbol=BTCUSDT"],
  ["/api?__path=wallet/recipients&q=ada", "/api/wallet/recipients?q=ada"],
  ["/api?__path=", "/api"],
  ["/api/health", "/api/health"],
  ["/api/market/prices?symbol=ETHUSDT", "/api/market/prices?symbol=ETHUSDT"],
];

/**
 * Cada caso simula lo que Vercel entrega tras aplicar la reescritura
 * `/api/(.*)` -> `/api?__path=$1`.
 */
const CASOS = [
  { nombre: "una ruta simple", url: "/api?__path=health", contiene: '"ok"' },
  {
    nombre: "una ruta de dos segmentos",
    url: "/api?__path=market/tokens",
    contiene: '"tokens"',
  },
  {
    nombre: "una peticion directa, sin reescribir",
    url: "/api/health",
    contiene: '"ok"',
  },
  {
    nombre: "una ruta inexistente devuelve el 404 de la aplicacion",
    url: "/api?__path=no/existe/aqui",
    contiene: '"NOT_FOUND"',
  },
];

let codigo = 0;

try {
  console.log("Empaquetando api/index.ts como hace Vercel...");
  execFileSync(
    process.execPath,
    [
      join(root, "node_modules", "esbuild", "bin", "esbuild"),
      join(root, "api", "index.ts"),
      "--bundle",
      "--platform=node",
      "--target=node22",
      "--format=esm",
      `--outfile=${bundle}`,
      "--log-level=warning",
    ],
    { stdio: "inherit" },
  );

  console.log("Cargando el modulo...");
  const modulo = await import(pathToFileURL(bundle).href);
  const handler = modulo.default;
  if (typeof handler !== "function") {
    throw new Error("La funcion no exporta un manejador por defecto.");
  }

  console.log("Reconstruccion de la ruta original:");
  for (const [entrada, esperado] of RUTAS) {
    const obtenido = modulo.restoreOriginalUrl(entrada);
    if (obtenido !== esperado) {
      throw new Error(`${entrada} -> ${obtenido}, se esperaba ${esperado}`);
    }
    console.log(`  ok  ${entrada}  ->  ${esperado}`);
  }

  console.log("Respuesta de la funcion:");

  for (const caso of CASOS) {
    const socket = new Socket();
    const req = new IncomingMessage(socket);
    req.method = "GET";
    req.url = caso.url;
    req.headers = { host: "localhost" };
    req.push(null);

    const res = new ServerResponse(req);
    let cuerpo = "";
    res.write = (trozo) => {
      cuerpo += trozo;
      return true;
    };

    await new Promise((terminar, fallar) => {
      const finOriginal = res.end.bind(res);
      res.end = (trozo) => {
        if (trozo) cuerpo += trozo;
        terminar();
        return finOriginal();
      };
      Promise.resolve(handler(req, res)).catch(fallar);
      setTimeout(() => fallar(new Error(`Sin respuesta en 20 s: ${caso.url}`)), 20_000);
    });

    if (caso.contiene && !cuerpo.includes(caso.contiene)) {
      throw new Error(
        `${caso.nombre}: se esperaba ${caso.contiene} y llego ${res.statusCode} ${cuerpo.slice(0, 160)}`,
      );
    }
    if (caso.noContiene && cuerpo.includes(caso.noContiene)) {
      throw new Error(
        `${caso.nombre}: no deberia contener ${caso.noContiene}; llego ${res.statusCode} ${cuerpo.slice(0, 160)}`,
      );
    }

    console.log(`  ok  ${caso.nombre} (${res.statusCode})`);
  }

  console.log("La funcion arranca y enruta correctamente.");
} catch (error) {
  console.error("\nLa funcion de Vercel no supera la comprobacion:");
  console.error(error instanceof Error ? (error.stack ?? error.message) : error);
  codigo = 1;
} finally {
  rmSync(salida, { recursive: true, force: true });
}

process.exit(codigo);
