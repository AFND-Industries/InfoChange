import { scrypt, scryptSync } from "node:crypto";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";

import { getDatabase } from "./db/client.js";
import { onError, onNotFound } from "./middleware/error-handler.js";
import { adminRoutes } from "./routes/admin.js";
import { authRoutes } from "./routes/auth.js";
import { historyRoutes } from "./routes/history.js";
import { marketRoutes } from "./routes/market.js";
import { walletRoutes } from "./routes/wallet.js";
import { withSession } from "./routes/shared.js";
import type { AppEnv } from "./types.js";

/**
 * Toda la API es una unica funcion en Vercel y Hono resuelve el enrutado por
 * dentro. Un fichero por endpoint habria superado el limite de funciones del
 * plan gratuito y multiplicado los arranques en frio.
 */
export const app = new Hono<AppEnv>().basePath("/api");

app.use("*", secureHeaders());

/**
 * Solo hace falta CORS si el frontend se sirve desde otro dominio. En el
 * despliegue normal comparten origen, asi que la cabecera no llega a emitirse.
 */
app.use("*", async (c, next) => {
  const origin = process.env.CORS_ORIGIN;
  if (!origin) return next();

  const allowed = origin.split(",").map((value) => value.trim());
  return cors({
    origin: (requestOrigin) =>
      allowed.includes(requestOrigin) ? requestOrigin : null,
    credentials: true,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })(c, next);
});

/**
 * Antes de la base de datos y de la sesion, para que siga respondiendo aunque
 * falte configuracion: es lo primero que se mira cuando un despliegue no
 * levanta.
 */
app.get("/health", async (c) => {
  /**
   * Ademas del estado, se mide el coste de un scrypt pequeno por las dos vias.
   * El hash de contrasenas es lo unico que consume CPU de forma apreciable, y
   * en esta plataforma la version asincrona resulto ser ordenes de magnitud mas
   * lenta: al delegar en el threadpool, el hilo principal queda esperando, la
   * funcion parece ociosa y se le recorta la CPU. Tener las dos medidas juntas
   * permite verlo de un vistazo en lugar de deducirlo.
   *
   * El coste es minimo (N=1024, unas decimas de milisegundo) para que la ruta
   * no sirva como palanca de abuso.
   */
  const medir = async (ejecutar: () => Promise<unknown> | unknown) => {
    const inicio = performance.now();
    await ejecutar();
    return Number((performance.now() - inicio).toFixed(1));
  };

  const opciones = { N: 1024, r: 8, p: 1 };
  const sincrono = await medir(() => scryptSync("medida", "medida", 32, opciones));
  const asincrono = await medir(
    () =>
      new Promise((resolver, rechazar) =>
        scrypt("medida", "medida", 32, opciones, (error) =>
          error ? rechazar(error) : resolver(undefined),
        ),
      ),
  );

  return c.json({
    status: "ok",
    runtime: process.version,
    scryptMs: { sincrono, asincrono },
    timestamp: new Date().toISOString(),
  });
});

/** Indice de la API, para que `/api` a secas no devuelva un 404 desconcertante. */
app.get("/", (c) =>
  c.json({
    name: "InfoChange API",
    docs: "https://github.com/AFND-Industries/InfoChange/blob/main/docs/api.md",
    endpoints: ["/api/health", "/api/auth", "/api/market", "/api/wallet", "/api/history"],
  }),
);

app.use("*", async (c, next) => {
  // Se puede haber inyectado una base de datos (tests); si no, se abre la real.
  if (!c.get("db")) c.set("db", getDatabase());
  await next();
});

app.use("*", withSession);

app.route("/auth", authRoutes);
app.route("/market", marketRoutes);
app.route("/wallet", walletRoutes);
app.route("/history", historyRoutes);
app.route("/admin", adminRoutes);

app.onError(onError);
app.notFound(onNotFound);

export type App = typeof app;
export default app;
