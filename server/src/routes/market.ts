import { Hono } from "hono";

import {
  getCoins,
  getPrice,
  getPrices,
  getTokenCatalog,
  getTradingPairs,
} from "../lib/market.js";
import type { AppEnv } from "./shared.js";

export const marketRoutes = new Hono<AppEnv>();

/**
 * Rutas publicas y cacheables. `s-maxage` deja el trabajo en la CDN de Vercel,
 * asi que Binance recibe como mucho una peticion por ventana aunque haya mil
 * pestanas abiertas, y `stale-while-revalidate` evita que nadie espere a que se
 * refresque.
 */
const cacheFor = (seconds: number, staleSeconds: number) =>
  `public, max-age=0, s-maxage=${seconds}, stale-while-revalidate=${staleSeconds}`;

/** Catalogo de nombres y logos. Cambia muy de vez en cuando. */
marketRoutes.get("/tokens", (c) => {
  c.header("Cache-Control", cacheFor(86_400, 604_800));
  return c.json({ tokens: getTokenCatalog() });
});

marketRoutes.get("/symbols", async (c) => {
  const pairs = await getTradingPairs();
  c.header("Cache-Control", cacheFor(3600, 86_400));
  return c.json({ symbols: pairs });
});

marketRoutes.get("/prices", async (c) => {
  const symbol = c.req.query("symbol");

  if (symbol) {
    const price = await getPrice(symbol);
    c.header("Cache-Control", cacheFor(10, 60));
    return c.json({ price });
  }

  const prices = await getPrices();
  c.header("Cache-Control", cacheFor(10, 60));
  return c.json({ prices });
});

marketRoutes.get("/coins", async (c) => {
  const coins = await getCoins();
  c.header("Cache-Control", cacheFor(60, 300));
  return c.json({ coins, updatedAt: new Date().toISOString() });
});
