import { tokenCatalog, type TokenInfo } from "../data/tokens";
import { badGateway, notFound } from "./errors";

const BINANCE = "https://api.binance.com/api/v3";
/**
 * Por debajo de los 10 s que dura por defecto una funcion en el plan gratuito,
 * para que un Binance lento devuelva un error controlado en vez de agotar la
 * invocacion entera.
 */
const REQUEST_TIMEOUT_MS = 6000;

export interface Price {
  symbol: string;
  price: string;
}

export interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  baseAssetName: string;
  quoteAssetName: string;
  decimalPlaces: number;
}

export interface CoinTicker {
  symbol: string;
  baseAsset: string;
  name: string;
  logo: string;
  price: string;
  priceChangePercent: string;
  volume: string;
  quoteVolume: string;
  highPrice: string;
  lowPrice: string;
}

/**
 * Cache en memoria del modulo. Sobrevive entre invocaciones calientes de la
 * misma instancia, pero no es la defensa principal: las rutas publicas se
 * sirven con `Cache-Control`, de modo que la CDN de Vercel absorbe casi todo el
 * trafico y Binance recibe como mucho una peticion por ventana.
 *
 * La version anterior mantenia dos `setInterval` disparando cada 10 y cada 120
 * segundos desde el momento en que se importaba el modulo. En serverless eso o
 * no llega a ejecutarse o se multiplica por cada arranque en frio.
 */
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

async function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.value as T;

  try {
    const value = await load();
    cache.set(key, { value, expiresAt: Date.now() + ttlMs });
    return value;
  } catch (error) {
    // Ante un fallo puntual de Binance es preferible servir datos algo viejos
    // que dejar la aplicacion sin precios.
    if (hit) return hit.value as T;
    throw error;
  }
}

export function clearMarketCache(): void {
  cache.clear();
}

async function binance<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BINANCE}${path}`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { accept: "application/json" },
    });
  } catch {
    throw badGateway("MARKET_UNAVAILABLE", "No se pudo contactar con el mercado.");
  }

  if (!response.ok) {
    throw badGateway("MARKET_UNAVAILABLE", "El mercado devolvio una respuesta invalida.");
  }

  return (await response.json()) as T;
}

export const getToken = (asset: string): TokenInfo | undefined =>
  tokenCatalog[asset.toUpperCase()];

export const getTokenCatalog = (): Record<string, TokenInfo> => tokenCatalog;

/** Numero de decimales significativos que implica un `tickSize` de Binance. */
function decimalsFromTickSize(tickSize: string): number {
  const trimmed = tickSize.replace(/0+$/, "");
  const dot = trimmed.indexOf(".");
  return dot === -1 ? 0 : trimmed.length - dot - 1;
}

interface RawExchangeInfo {
  symbols: Array<{
    symbol: string;
    status: string;
    baseAsset: string;
    quoteAsset: string;
    isSpotTradingAllowed: boolean;
    filters: Array<{ filterType: string; tickSize?: string }>;
  }>;
}

/**
 * Pares negociables, derivados en vivo de Binance en lugar del `Symbols.json`
 * de 708 kB congelado en marzo de 2024 que arrastraba el frontend.
 */
export async function getTradingPairs(): Promise<TradingPair[]> {
  return cached("pairs", 60 * 60 * 1000, async () => {
    const data = await binance<RawExchangeInfo>("/exchangeInfo?permissions=SPOT");

    const pairs: TradingPair[] = [];
    for (const entry of data.symbols) {
      if (entry.status !== "TRADING" || !entry.isSpotTradingAllowed) continue;

      const base = getToken(entry.baseAsset);
      const quote = getToken(entry.quoteAsset);
      if (!base || !quote) continue;

      const priceFilter = entry.filters.find((f) => f.filterType === "PRICE_FILTER");
      pairs.push({
        symbol: entry.symbol,
        baseAsset: entry.baseAsset,
        quoteAsset: entry.quoteAsset,
        baseAssetName: base.name,
        quoteAssetName: quote.name,
        decimalPlaces: decimalsFromTickSize(priceFilter?.tickSize ?? "0.01"),
      });
    }

    return pairs.sort((a, b) => a.symbol.localeCompare(b.symbol));
  });
}

export async function getTradingPair(symbol: string): Promise<TradingPair | undefined> {
  const pairs = await getTradingPairs();
  return pairs.find((pair) => pair.symbol === symbol.toUpperCase());
}

export async function getPrices(): Promise<Price[]> {
  return cached("prices", 10_000, () => binance<Price[]>("/ticker/price"));
}

export async function getPrice(symbol: string): Promise<Price> {
  const prices = await getPrices();
  const found = prices.find((entry) => entry.symbol === symbol.toUpperCase());
  if (!found) throw notFound("UNKNOWN_SYMBOL", "El par solicitado no existe.");
  return found;
}

interface RawTicker24h {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
  quoteVolume: string;
  highPrice: string;
  lowPrice: string;
}

/** Resumen de 24 h de los activos con contrapartida en USDT. */
export async function getCoins(): Promise<CoinTicker[]> {
  return cached("coins", 60_000, async () => {
    const data = await binance<RawTicker24h[]>("/ticker/24hr");

    const coins: CoinTicker[] = [];
    for (const ticker of data) {
      if (!ticker.symbol.endsWith("USDT")) continue;

      const baseAsset = ticker.symbol.slice(0, -4);
      const token = getToken(baseAsset);
      if (!token) continue;

      coins.push({
        symbol: ticker.symbol,
        baseAsset,
        name: token.name,
        logo: token.logo,
        price: ticker.lastPrice,
        priceChangePercent: ticker.priceChangePercent,
        volume: ticker.volume,
        quoteVolume: ticker.quoteVolume,
        highPrice: ticker.highPrice,
        lowPrice: ticker.lowPrice,
      });
    }

    return coins.sort(
      (a, b) => Number(b.quoteVolume) - Number(a.quoteVolume),
    );
  });
}
