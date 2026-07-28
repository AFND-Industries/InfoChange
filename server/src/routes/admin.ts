import { Decimal } from "decimal.js";
import { count, desc, eq, gt, sql, sum } from "drizzle-orm";
import { Hono } from "hono";

import { payments, trades, transfers, users, wallets } from "../db/schema";
import { getPrices, getToken } from "../lib/market";
import { toApi } from "../lib/money";
import { requireAdmin, requireAuth, type AppEnv } from "./shared";

export const adminRoutes = new Hono<AppEnv>();

adminRoutes.use("*", requireAuth, requireAdmin);

/** Cotizacion de un activo en USDT. Devuelve 0 si el mercado no lo lista. */
function valuation(prices: Map<string, string>) {
  return (asset: string): Decimal => {
    if (asset === "USDT") return new Decimal(1);
    const quote = prices.get(`${asset}USDT`);
    return quote ? new Decimal(quote) : new Decimal(0);
  };
}

/**
 * Metricas ya agregadas. Antes esta ruta volcaba usuarios, carteras e historial
 * completos, el navegador los recalculaba en cada refresco y ademas los
 * imprimia por consola cada diez segundos.
 */
adminRoutes.get("/overview", async (c) => {
  const db = c.get("db");
  const priceList = await getPrices();
  const priceOf = valuation(new Map(priceList.map((p) => [p.symbol, p.price])));

  const [
    userCount,
    tradeCount,
    transferCount,
    feeRows,
    holdings,
    tradedIn,
    tradedOut,
    recentTransfers,
    recentPayments,
  ] = await Promise.all([
    db.select({ value: count() }).from(users),
    db.select({ value: count() }).from(trades),
    db.select({ value: count() }).from(transfers),
    db
      .select({ asset: trades.paidAsset, total: sum(trades.fee) })
      .from(trades)
      .groupBy(trades.paidAsset),
    db
      .select({
        userId: wallets.userId,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        asset: wallets.asset,
        quantity: wallets.quantity,
      })
      .from(wallets)
      .innerJoin(users, eq(users.id, wallets.userId))
      .where(gt(wallets.quantity, "0")),
    db
      .select({ asset: trades.paidAsset, total: sum(trades.paidAmount) })
      .from(trades)
      .groupBy(trades.paidAsset),
    db
      .select({ asset: trades.receivedAsset, total: sum(trades.receivedAmount) })
      .from(trades)
      .groupBy(trades.receivedAsset),
    db
      .select({
        id: transfers.id,
        amount: transfers.amount,
        asset: transfers.asset,
        createdAt: transfers.createdAt,
        senderUsername: sql<string>`sender.username`,
        recipientUsername: sql<string>`recipient.username`,
      })
      .from(transfers)
      .innerJoin(sql`${users} as sender`, sql`sender.id = ${transfers.senderId}`)
      .innerJoin(sql`${users} as recipient`, sql`recipient.id = ${transfers.recipientId}`)
      .orderBy(desc(transfers.createdAt))
      .limit(5),
    db
      .select({
        id: payments.id,
        kind: payments.kind,
        amount: payments.amount,
        asset: payments.asset,
        method: payments.method,
        createdAt: payments.createdAt,
        username: users.username,
      })
      .from(payments)
      .innerJoin(users, eq(users.id, payments.userId))
      .orderBy(desc(payments.createdAt))
      .limit(5),
  ]);

  const totalFees = feeRows.reduce(
    (acc, row) => acc.plus(new Decimal(row.total ?? 0).times(priceOf(row.asset))),
    new Decimal(0),
  );

  // Saldo total del exchange y ranking de usuarios, valorados en USDT.
  const balanceByUser = new Map<
    number,
    { username: string; firstName: string; lastName: string; total: Decimal }
  >();
  let totalBalance = new Decimal(0);

  for (const row of holdings) {
    const value = new Decimal(row.quantity).times(priceOf(row.asset));
    totalBalance = totalBalance.plus(value);

    const current = balanceByUser.get(row.userId);
    if (current) {
      current.total = current.total.plus(value);
    } else {
      balanceByUser.set(row.userId, {
        username: row.username,
        firstName: row.firstName,
        lastName: row.lastName,
        total: value,
      });
    }
  }

  const topUsers = [...balanceByUser.entries()]
    .map(([userId, entry]) => ({ userId, ...entry }))
    .sort((a, b) => b.total.comparedTo(a.total))
    .slice(0, 5)
    .map((entry) => ({
      userId: entry.userId,
      username: entry.username,
      firstName: entry.firstName,
      lastName: entry.lastName,
      balanceUsd: toApi(entry.total.toDecimalPlaces(2)),
    }));

  // Volumen negociado por activo: lo que ha entrado mas lo que ha salido.
  const volumeByAsset = new Map<string, Decimal>();
  for (const row of [...tradedIn, ...tradedOut]) {
    const previous = volumeByAsset.get(row.asset) ?? new Decimal(0);
    volumeByAsset.set(row.asset, previous.plus(new Decimal(row.total ?? 0)));
  }

  const topAssets = [...volumeByAsset.entries()]
    .map(([asset, volume]) => ({
      asset,
      name: getToken(asset)?.name ?? asset,
      logo: getToken(asset)?.logo ?? null,
      volume: toApi(volume),
      volumeUsd: toApi(volume.times(priceOf(asset)).toDecimalPlaces(2)),
    }))
    .sort((a, b) => Number(b.volumeUsd) - Number(a.volumeUsd))
    .slice(0, 5);

  return c.json({
    totals: {
      users: userCount[0]?.value ?? 0,
      trades: tradeCount[0]?.value ?? 0,
      transfers: transferCount[0]?.value ?? 0,
      feesUsd: toApi(totalFees.toDecimalPlaces(2)),
      balanceUsd: toApi(totalBalance.toDecimalPlaces(2)),
    },
    topUsers,
    topAssets,
    recentTransfers: recentTransfers.map((row) => ({
      id: row.id,
      amount: toApi(row.amount),
      asset: row.asset,
      sender: row.senderUsername,
      recipient: row.recipientUsername,
      createdAt: row.createdAt.toISOString(),
    })),
    recentPayments: recentPayments.map((row) => ({
      id: row.id,
      kind: row.kind,
      amount: toApi(row.amount),
      asset: row.asset,
      method: row.method,
      username: row.username,
      createdAt: row.createdAt.toISOString(),
    })),
  });
});
