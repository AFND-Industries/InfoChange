/**
 * Comprueba que la funcion de Vercel se empaqueta y arranca.
 *
 * Existe por un fallo real: el paquete `ws` es CommonJS y hace `require()` por
 * dentro, asi que al empaquetar la funcion como ESM reventaba nada mas cargar el
 * modulo ("Dynamic require of events is not supported"). Ni el typecheck, ni el
 * lint, ni los tests, ni el build lo detectaban, porque ninguno llega a ejecutar
 * el artefacto que se despliega: el error solo aparecia en produccion como
 * FUNCTION_INVOCATION_FAILED.
 *
 * No necesita base de datos: `/api/health` responde antes de tocarla.
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

let codigo = 0;

try {
  console.log("Empaquetando api/[...route].ts como hace Vercel...");
  execFileSync(
    process.execPath,
    [
      join(root, "node_modules", "esbuild", "bin", "esbuild"),
      join(root, "api", "[...route].ts"),
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
  const handler = (await import(pathToFileURL(bundle).href)).default;
  if (typeof handler !== "function") {
    throw new Error("La funcion no exporta un manejador por defecto.");
  }

  console.log("Invocando GET /api/health...");
  const socket = new Socket();
  const req = new IncomingMessage(socket);
  req.method = "GET";
  req.url = "/api/health";
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
    setTimeout(() => fallar(new Error("La funcion no respondio en 15 s.")), 15_000);
  });

  if (res.statusCode !== 200 || !cuerpo.includes('"ok"')) {
    throw new Error(`Respuesta inesperada: ${res.statusCode} ${cuerpo.slice(0, 200)}`);
  }

  console.log(`La funcion responde: ${res.statusCode} ${cuerpo.slice(0, 80)}`);
} catch (error) {
  console.error("\nLa funcion de Vercel no arranca:");
  console.error(error instanceof Error ? (error.stack ?? error.message) : error);
  codigo = 1;
} finally {
  rmSync(salida, { recursive: true, force: true });
}

process.exit(codigo);
