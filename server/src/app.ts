
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
app.get("/health", (c) =>
  c.json({
    status: "ok",
    runtime: process.version,
    timestamp: new Date().toISOString(),
  }),
);

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
