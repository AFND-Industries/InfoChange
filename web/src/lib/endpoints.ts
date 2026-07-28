import { api } from "./api";

/** Contratos de la API. Un unico sitio donde mirar que devuelve cada ruta. */

export interface User {
  id: number;
  username: string;
  email: string;
  role: "user" | "admin";
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  phone: string;
  /** 0 = interfaz sencilla, 1 = avanzada. */
  uiMode: number;
  createdAt: string;
}

export interface Balance {
  asset: string;
  quantity: string;
}

export interface Session {
  user: User;
  balances: Balance[];
}

/**
 * Respuesta de `/auth/me`. Que no haya sesion no es un error: llega un 200 con
 * `user: null`.
 */
export interface SessionState {
  user: User | null;
  balances: Balance[];
}

export interface UserSummary {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

export interface TokenInfo {
  name: string;
  logo: string;
  slug: string;
}

export interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  baseAssetName: string;
  quoteAssetName: string;
  decimalPlaces: number;
}

export interface Price {
  symbol: string;
  price: string;
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

export interface Trade {
  id: number;
  symbol: string;
  side: "BUY" | "SELL";
  paidAsset: string;
  paidAmount: string;
  receivedAsset: string;
  receivedAmount: string;
  fee: string;
  price: string;
  executedAt: string;
}

export interface Transfer {
  id: number;
  senderId: number;
  recipientId: number;
  asset: string;
  amount: string;
  createdAt: string;
}

export interface Payment {
  id: number;
  kind: "DEPOSIT" | "WITHDRAWAL";
  asset: string;
  amount: string;
  method: string;
  methodReference: string | null;
  createdAt: string;
}

export interface AdminOverview {
  totals: {
    users: number;
    trades: number;
    transfers: number;
    feesUsd: string;
    balanceUsd: string;
  };
  topUsers: Array<{
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    balanceUsd: string;
  }>;
  topAssets: Array<{
    asset: string;
    name: string;
    logo: string | null;
    volume: string;
    volumeUsd: string;
  }>;
  recentTransfers: Array<{
    id: number;
    amount: string;
    asset: string;
    sender: string;
    recipient: string;
    createdAt: string;
  }>;
  recentPayments: Array<{
    id: number;
    kind: string;
    amount: string;
    asset: string;
    method: string;
    username: string;
    createdAt: string;
  }>;
}

export type PaymentMethod =
  | { type: "CARD"; holder: string; number: string; expiry: string; cvv: string }
  | { type: "IBAN"; holder: string; iban: string }
  | { type: "PAYPAL"; email: string };

export interface RegisterInput {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: "male" | "female" | "other";
  username: string;
  email: string;
  password: string;
  securityQuestionId: number;
  securityAnswer: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  phone: string;
  documentId: string;
}

export const endpoints = {
  auth: {
    me: () => api.get<SessionState>("/auth/me"),
    login: (username: string, password: string) =>
      api.post<Session>("/auth/login", { username, password }),
    register: (input: RegisterInput) => api.post<Session>("/auth/register", input),
    logout: () => api.post<{ ok: boolean }>("/auth/logout"),
    checkEmail: (email: string) =>
      api.post<{ available: boolean }>("/auth/check-email", { email }),
    securityQuestions: () =>
      api.get<{ questions: Array<{ id: number; prompt: string }> }>(
        "/auth/security-questions",
      ),
    toggleUiMode: () => api.post<{ user: User }>("/auth/me/ui-mode"),
  },

  market: {
    tokens: () => api.get<{ tokens: Record<string, TokenInfo> }>("/market/tokens"),
    symbols: () => api.get<{ symbols: TradingPair[] }>("/market/symbols"),
    prices: () => api.get<{ prices: Price[] }>("/market/prices"),
    price: (symbol: string) =>
      api.get<{ price: Price }>("/market/prices", { query: { symbol } }),
    coins: () =>
      api.get<{ coins: CoinTicker[]; updatedAt: string }>("/market/coins"),
  },

  wallet: {
    balances: () => api.get<{ balances: Balance[] }>("/wallet"),
    recipients: (query?: string) =>
      api.get<{ recipients: UserSummary[] }>("/wallet/recipients", {
        query: { q: query },
      }),
    trade: (symbol: string, quantity: string, side: "BUY" | "SELL") =>
      api.post<{ trade: Trade }>("/wallet/trade", { symbol, quantity, side }),
    transfer: (recipientId: number, amount: string) =>
      api.post<{ transfer: Transfer }>("/wallet/transfers", { recipientId, amount }),
    deposit: (amount: string, method: PaymentMethod) =>
      api.post<{ payment: Payment }>("/wallet/deposits", { amount, method }),
    withdraw: (amount: string, method: PaymentMethod) =>
      api.post<{ payment: Payment }>("/wallet/withdrawals", { amount, method }),
  },

  history: {
    trades: () => api.get<{ trades: Trade[] }>("/history/trades"),
    payments: () => api.get<{ payments: Payment[] }>("/history/payments"),
    transfers: () => api.get<{ transfers: Transfer[] }>("/history/transfers"),
  },

  admin: {
    overview: () => api.get<AdminOverview>("/admin/overview"),
  },
};

/**
 * Descripciones largas, enlaces y etiquetas de cada activo. Son 540 kB que solo
 * necesita la ficha de una moneda, asi que se sirven como fichero estatico y se
 * piden bajo demanda en lugar de empaquetarse con la aplicacion.
 */
export interface TokenDetails {
  description: string;
  urls: Record<string, string[]>;
  tags: string[];
}

export async function fetchTokenDetails(): Promise<Record<string, TokenDetails>> {
  const response = await fetch("/data/token-details.json");
  if (!response.ok) throw new Error("No se pudo cargar el detalle de los activos.");
  return (await response.json()) as Record<string, TokenDetails>;
}
