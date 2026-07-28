import type { Payment, Trade, Transfer, User, Wallet } from "../db/schema";
import { toApi } from "./money";

/**
 * Forma publica del usuario. Existe para que anadir una columna sensible al
 * esquema no la exponga por accidente: la version anterior devolvia la fila
 * entera, con el hash de la contrasena incluido, en cada `/auth` (una peticion
 * cada cinco segundos).
 */
export interface PublicUser {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  phone: string;
  uiMode: number;
  createdAt: string;
}

export const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  firstName: user.firstName,
  lastName: user.lastName,
  birthDate: user.birthDate,
  gender: user.gender,
  address: user.address,
  city: user.city,
  zipCode: user.zipCode,
  country: user.country,
  phone: user.phone,
  uiMode: user.uiMode,
  createdAt: user.createdAt.toISOString(),
});

/** Datos minimos de otro usuario: lo justo para elegir destinatario. */
export interface UserSummary {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

export const toUserSummary = (
  user: Pick<User, "id" | "username" | "firstName" | "lastName">,
): UserSummary => ({
  id: user.id,
  username: user.username,
  firstName: user.firstName,
  lastName: user.lastName,
});

export const toBalance = (wallet: Pick<Wallet, "asset" | "quantity">) => ({
  asset: wallet.asset,
  quantity: toApi(wallet.quantity),
});

export const toTrade = (trade: Trade) => ({
  id: trade.id,
  symbol: trade.symbol,
  side: trade.side,
  paidAsset: trade.paidAsset,
  paidAmount: toApi(trade.paidAmount),
  receivedAsset: trade.receivedAsset,
  receivedAmount: toApi(trade.receivedAmount),
  fee: toApi(trade.fee),
  price: toApi(trade.price),
  executedAt: trade.executedAt.toISOString(),
});

export const toTransfer = (transfer: Transfer) => ({
  id: transfer.id,
  senderId: transfer.senderId,
  recipientId: transfer.recipientId,
  asset: transfer.asset,
  amount: toApi(transfer.amount),
  createdAt: transfer.createdAt.toISOString(),
});

export const toPayment = (payment: Payment) => ({
  id: payment.id,
  kind: payment.kind,
  asset: payment.asset,
  amount: toApi(payment.amount),
  method: payment.method,
  methodReference: payment.methodReference,
  createdAt: payment.createdAt.toISOString(),
});
