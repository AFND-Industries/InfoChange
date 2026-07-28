import type { Context, MiddlewareHandler } from "hono";

import { tooManyRequests } from "./errors.js";

interface Window {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Window>();

/**
 * Contador por ventana fija en memoria. En serverless el estado vive en cada
 * instancia, de modo que el limite real es aproximado: no sustituye a un
 * limitador distribuido, pero corta en seco el caso que importa aqui, que es
 * alguien probando contrasenas en bucle contra `/auth/login`. Antes no habia
 * ningun tipo de limite.
 */
export function rateLimit(options: {
  name: string;
  limit: number;
  windowMs: number;
  message?: string;
}): MiddlewareHandler {
  const { name, limit, windowMs } = options;
  const message =
    options.message ?? "Demasiados intentos. Espera un momento e intentalo de nuevo.";

  return async (c, next) => {
    const key = `${name}:${clientKey(c)}`;
    const now = Date.now();
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      pruneOccasionally(now);
      await next();
      return;
    }

    current.count += 1;
    if (current.count > limit) {
      c.header("Retry-After", String(Math.ceil((current.resetAt - now) / 1000)));
      throw tooManyRequests(message);
    }

    await next();
  };
}

function clientKey(c: Context): string {
  // En Vercel el cliente real llega en `x-forwarded-for`; el primer valor es el
  // unico que no puede falsificar quien hace la peticion.
  const forwarded = c.req.header("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return c.req.header("x-real-ip") ?? "unknown";
}

let lastPrune = 0;

function pruneOccasionally(now: number): void {
  if (now - lastPrune < 60_000) return;
  lastPrune = now;
  for (const [key, window] of buckets) {
    if (window.resetAt <= now) buckets.delete(key);
  }
}

export function resetRateLimits(): void {
  buckets.clear();
  lastPrune = 0;
}
