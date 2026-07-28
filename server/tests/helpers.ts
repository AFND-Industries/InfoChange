import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { vi } from "vitest";

import app from "../src/app";
import type { Database } from "../src/db/client";
import { setDatabase } from "../src/db/client";
import * as schema from "../src/db/schema";
import { SECURITY_QUESTIONS } from "../src/db/seed-data";
import { clearMarketCache } from "../src/lib/market";
import { resetRateLimits } from "../src/lib/rate-limit";

/**
 * Base de datos efimera con el esquema aplicado desde las migraciones reales,
 * no desde un `sync()`: si una migracion esta mal, los tests fallan.
 */
export async function createTestDatabase(): Promise<{
  db: Database;
  close: () => Promise<void>;
}> {
  const client = new PGlite();
  const db = drizzle(client, { schema });

  await migrate(db, { migrationsFolder: "./drizzle" });
  await db
    .insert(schema.securityQuestions)
    .values(SECURITY_QUESTIONS.map((prompt) => ({ prompt })));

  setDatabase(db);

  return {
    db,
    close: async () => {
      setDatabase(undefined);
      await client.close();
    },
  };
}

/** Precios y pares fijos, para que los tests no dependan de Binance. */
export const FAKE_PRICES = [
  { symbol: "BTCUSDT", price: "50000.00000000" },
  { symbol: "ETHUSDT", price: "2500.00000000" },
  { symbol: "ETHBTC", price: "0.05000000" },
];

export function stubBinance(): void {
  clearMarketCache();

  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL | Request) => {
      const url = String(input);

      if (url.includes("/exchangeInfo")) {
        return Response.json({
          symbols: [
            makeSymbol("BTCUSDT", "BTC", "USDT", "0.01000000"),
            makeSymbol("ETHUSDT", "ETH", "USDT", "0.01000000"),
            makeSymbol("ETHBTC", "ETH", "BTC", "0.00001000"),
          ],
        });
      }

      if (url.includes("/ticker/price")) return Response.json(FAKE_PRICES);

      if (url.includes("/ticker/24hr")) {
        return Response.json([
          {
            symbol: "BTCUSDT",
            lastPrice: "50000",
            priceChangePercent: "1.5",
            volume: "1000",
            quoteVolume: "50000000",
            highPrice: "51000",
            lowPrice: "49000",
          },
        ]);
      }

      throw new Error(`Peticion no prevista en los tests: ${url}`);
    }),
  );
}

function makeSymbol(
  symbol: string,
  baseAsset: string,
  quoteAsset: string,
  tickSize: string,
) {
  return {
    symbol,
    status: "TRADING",
    baseAsset,
    quoteAsset,
    isSpotTradingAllowed: true,
    filters: [{ filterType: "PRICE_FILTER", tickSize }],
  };
}

export function resetTestState(): void {
  resetRateLimits();
  clearMarketCache();
}

/** Cliente HTTP contra la aplicacion, conservando la cookie de sesion. */
export class TestClient {
  private cookie: string | null = null;

  async request(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<{ status: number; body: any; headers: Headers }> {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (this.cookie) headers["Cookie"] = this.cookie;

    const response = await app.request(`http://localhost${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const setCookie = response.headers.get("set-cookie");
    if (setCookie) this.cookie = setCookie.split(";")[0]!;

    const text = await response.text();
    return {
      status: response.status,
      body: text ? JSON.parse(text) : null,
      headers: response.headers,
    };
  }

  get = (path: string) => this.request("GET", path);
  post = (path: string, body?: unknown) => this.request("POST", path, body);

  clearCookie(): void {
    this.cookie = null;
  }
}

export const VALID_REGISTRATION = {
  firstName: "Ada",
  lastName: "Lovelace",
  birthDate: "1990-05-12",
  gender: "female" as const,
  username: "ada",
  email: "ada@example.com",
  password: "contrasena123",
  securityQuestionId: 1,
  securityAnswer: "Analitica",
  address: "Calle Mayor 1",
  city: "Malaga",
  zipCode: "29010",
  country: "Espana",
  phone: "600000000",
  documentId: "12345678Z",
};

export const registrationFor = (username: string) => ({
  ...VALID_REGISTRATION,
  username,
  email: `${username}@example.com`,
});
