import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import {
  endpoints,
  fetchTokenDetails,
  type TokenInfo,
  type TradingPair,
} from "../lib/endpoints";
import { queryKeys } from "../lib/query-client";

/** Catalogo de nombres y logos. Practicamente inmutable, se cachea sin caducidad. */
export function useTokens() {
  return useQuery({
    queryKey: queryKeys.tokens,
    queryFn: () => endpoints.market.tokens(),
    staleTime: Infinity,
    gcTime: Infinity,
    select: (data) => data.tokens,
  });
}

export function useTokenLookup(): (asset: string) => TokenInfo | undefined {
  const { data } = useTokens();
  return useCallback((asset: string) => data?.[asset?.toUpperCase()], [data]);
}

/** Pares negociables, ahora en vivo desde Binance en vez de un JSON de 2024. */
export function useSymbols() {
  return useQuery({
    queryKey: queryKeys.symbols,
    queryFn: () => endpoints.market.symbols(),
    staleTime: 60 * 60 * 1000,
    select: (data) => data.symbols,
  });
}

export function usePrices() {
  return useQuery({
    queryKey: queryKeys.prices,
    queryFn: () => endpoints.market.prices(),
    // La respuesta se cachea en la CDN 10 s; refrescar cada 15 s en la pestana
    // activa da sensacion de tiempo real sin bombardear la API.
    refetchInterval: 15_000,
    staleTime: 10_000,
    select: (data) => data.prices,
  });
}

/** Precio de un activo en USDT, listo para valorar carteras. */
export function usePriceLookup(): (asset: string) => number {
  const { data } = usePrices();

  const index = useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of data ?? []) map.set(entry.symbol, Number(entry.price));
    return map;
  }, [data]);

  return useCallback(
    (asset: string) => {
      if (!asset) return 0;
      const upper = asset.toUpperCase();
      if (upper === "USDT") return 1;
      return index.get(`${upper}USDT`) ?? 0;
    },
    [index],
  );
}

export function usePairPrice(symbol: string | undefined) {
  const { data } = usePrices();

  return useMemo(() => {
    if (!symbol || !data) return undefined;
    const found = data.find((entry) => entry.symbol === symbol.toUpperCase());
    return found ? Number(found.price) : undefined;
  }, [data, symbol]);
}

export function usePair(symbol: string | undefined): TradingPair | undefined {
  const { data } = useSymbols();
  return useMemo(
    () => data?.find((pair) => pair.symbol === symbol?.toUpperCase()),
    [data, symbol],
  );
}

export function useCoins() {
  return useQuery({
    queryKey: queryKeys.coins,
    queryFn: () => endpoints.market.coins(),
    refetchInterval: 60_000,
    staleTime: 60_000,
  });
}

/**
 * Descripciones y enlaces largos: 540 kB que solo pide la ficha de una moneda.
 * Al ser una consulta aparte, el resto de la aplicacion nunca los descarga.
 */
export function useTokenDetails(enabled = true) {
  return useQuery({
    queryKey: queryKeys.tokenDetails,
    queryFn: fetchTokenDetails,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled,
  });
}
