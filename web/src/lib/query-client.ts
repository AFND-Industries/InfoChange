import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "./api";

/** Claves de cache en un solo sitio, para no invalidar por cadenas sueltas. */
export const queryKeys = {
  session: ["session"] as const,
  tokens: ["market", "tokens"] as const,
  symbols: ["market", "symbols"] as const,
  prices: ["market", "prices"] as const,
  coins: ["market", "coins"] as const,
  tokenDetails: ["market", "token-details"] as const,
  balances: ["wallet", "balances"] as const,
  recipients: (query: string) => ["wallet", "recipients", query] as const,
  tradeHistory: ["history", "trades"] as const,
  paymentHistory: ["history", "payments"] as const,
  transferHistory: ["history", "transfers"] as const,
  adminOverview: ["admin", "overview"] as const,
};

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Sustituye a los cuatro `setInterval` que la version anterior tenia
        // corriendo siempre (auth y cartera cada 5 s, precios y admin cada 10 s,
        // monedas cada 120 s), incluso en la pagina publica y con la pestana en
        // segundo plano. Ahora se refresca al volver a la pestana y cuando una
        // mutacion invalida los datos afectados.
        staleTime: 30_000,
        refetchOnWindowFocus: true,
        refetchIntervalInBackground: false,
        retry: (failureCount, error) => {
          // Reintentar un 401 o un 404 no arregla nada.
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}
