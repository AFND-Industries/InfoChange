/**
 * Comprueba que la funcion de Vercel compila, arranca y enruta bien.
 *
 * Replica el proceso real de Vercel: **transpila con TypeScript y deja que Node
 * resuelva los modulos**, sin empaquetar. Esa distincion importa, porque un
 * empaquetador resuelve imports que Node rechaza, y entonces la comprobacion
 * daria verde sobre algo que en produccion no arranca.
 *
 * Existe por tres fallos reales, ninguno detectado por el typecheck, el lint,
 * los tests ni el build, porque ninguno llega a ejecutar el artefacto desplegado:
 *
 *   1. El paquete `ws` es CommonJS y hace `require()` por dentro, asi que al
 *      empaquetar como ESM la funcion reventaba al cargar el modulo.
 *   2. `api/[...route].ts` no se comportaba como comodin en Vercel sino como un
 *      parametro de un solo segmento: `/api/health` funcionaba y
 *      `/api/market/tokens` devolvia 404.
 *   3. Los imports relativos sin extension `.js`, validos con
 *      `moduleResolution: bundler`, los rechaza Node en ESM.
 *
 * No necesita base de datos: se usan rutas que responden sin tocarla.
 */
import { execFileSync } from "node:child_process";
import { IncomingMessage, ServerResponse } from "node:http";
import { existsSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { Socket } from "node:net";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(fileURLToPath(import.meta.url), "../..");

/**
 * Se compila dentro del repositorio, no en el directorio temporal del sistema,
 * para que Node encuentre `node_modules` al resolver las dependencias.
 */
const salida = join(root, ".vercel-check");
const entrada = join(salida, "api", "index.js");

// Valores de relleno: no se abre ninguna conexion (el pool es perezoso), pero
// la aplicacion exige que la configuracion sea valida para arrancar.
process.env.NODE_ENV = "production";
process.env.DATABASE_URL ??= "postgresql://check:check@localhost:5432/check";
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
    nombre: "el indice de la API",
    url: "/api?__path=",
    contiene: "InfoChange API",
  },
  {
    nombre: "una ruta inexistente devuelve el 404 de la aplicacion",
    url: "/api?__path=no/existe/aqui",
    contiene: '"NOT_FOUND"',
  },
];

let codigo = 0;

try {
  rmSync(salida, { recursive: true, force: true });
  mkdirSync(salida, { recursive: true });

  console.log("Compilando api/index.ts igual que Vercel (TypeScript + Node ESM)...");
  execFileSync(
    process.execPath,
    [
      join(root, "node_modules", "typescript", "bin", "tsc"),
      join(root, "api", "index.ts"),
      "--outDir",
      salida,
      "--rootDir",
      root,
      "--module",
      "NodeNext",
      "--moduleResolution",
      "NodeNext",
      "--target",
      "ES2022",
      "--skipLibCheck",
      "--esModuleInterop",
      "--resolveJsonModule",
    ],
    { stdio: "inherit", cwd: root },
  );

  // Node necesita saber que los .js emitidos son modulos ES.
  writeFileSync(join(salida, "package.json"), JSON.stringify({ type: "module" }));

  /**
   * Al compilar fuera de su sitio, los ficheros de `server/` pierden de vista
   * `server/node_modules`, donde npm deja las dependencias que no ha subido a la
   * raiz. En el despliegue no pasa, porque Vercel resuelve sobre el arbol
   * original; aqui se reproduce esa vecindad con un enlace.
   */
  const dependenciasServidor = join(root, "server", "node_modules");
  if (existsSync(dependenciasServidor)) {
    symlinkSync(dependenciasServidor, join(salida, "server", "node_modules"), "junction");
  }

  console.log("Cargando el modulo con la resolucion real de Node...");
  const modulo = await import(pathToFileURL(entrada).href);
  const handler = modulo.default;
  if (typeof handler !== "function") {
    throw new Error("La funcion no exporta un manejador por defecto.");
  }

  console.log("Reconstruccion de la ruta original:");
  for (const [origen, esperado] of RUTAS) {
    const obtenido = modulo.restoreOriginalUrl(origen);
    if (obtenido !== esperado) {
      throw new Error(`${origen} -> ${obtenido}, se esperaba ${esperado}`);
    }
    console.log(`  ok  ${origen}  ->  ${esperado}`);
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

    if (!cuerpo.includes(caso.contiene)) {
      throw new Error(
        `${caso.nombre}: se esperaba ${caso.contiene} y llego ${res.statusCode} ${cuerpo.slice(0, 200)}`,
      );
    }

    console.log(`  ok  ${caso.nombre} (${res.statusCode})`);
  }

  console.log("La funcion compila, arranca y enruta correctamente.");
} catch (error) {
  console.error("\nLa funcion de Vercel no supera la comprobacion:");
  console.error(error instanceof Error ? (error.stack ?? error.message) : error);
  codigo = 1;
} finally {
  rmSync(salida, { recursive: true, force: true });
}

process.exit(codigo);
