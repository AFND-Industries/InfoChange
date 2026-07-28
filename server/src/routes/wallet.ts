import { Decimal } from "decimal.js";
import { and, eq, gt, ne, sql } from "drizzle-orm";
import { Hono } from "hono";

import { payments, trades, transfers, users, wallets } from "../db/schema.js";
import { credit, debit } from "../lib/balances.js";
import { badRequest, notFound } from "../lib/errors.js";
import { getPrice, getTradingPair } from "../lib/market.js";
import { money, toStorage } from "../lib/money.js";
import { rateLimit } from "../lib/rate-limit.js";
import {
  toBalance,
  toPayment,
  toTrade,
  toTransfer,
  toUserSummary,
} from "../lib/serializers.js";
import { maskPaymentMethod, paymentSchema, tradeSchema, transferSchema } from "../schemas.js";
import { requireAuth, type AppEnv } from "./shared.js";

/** Comision del exchange, 0,065 %. Se mantiene la de la version original. */
const TRADING_FEE = new Decimal("0.00065");
const SETTLEMENT_ASSET = "USDT";

export const walletRoutes = new Hono<AppEnv>();

walletRoutes.use("*", requireAuth);

walletRoutes.get("/", async (c) => {
  const balances = await c
    .get("db")
    .select({ asset: wallets.asset, quantity: wallets.quantity })
    .from(wallets)
    .where(and(eq(wallets.userId, c.get("user").id), gt(wallets.quantity, "0")));

  return c.json({ balances: balances.map(toBalance) });
});

/** Destinatarios posibles para una transferencia, con busqueda por nombre. */
walletRoutes.get("/recipients", async (c) => {
  const query = (c.req.query("q") ?? "").trim().slice(0, 40);
  const db = c.get("db");
  const userId = c.get("user").id;

  const filter = query
    ? and(
        ne(users.id, userId),
        sql`(${users.username} ilike ${`%${query}%`}
          or ${users.firstName} ilike ${`%${query}%`}
          or ${users.lastName} ilike ${`%${query}%`})`,
      )
    : ne(users.id, userId);

  const found = await db
    .select({
      id: users.id,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(users)
    .where(filter)
    .orderBy(users.username)
    .limit(20);

  return c.json({ recipients: found.map(toUserSummary) });
});

walletRoutes.post(
  "/trade",
  rateLimit({ name: "trade", limit: 60, windowMs: 60 * 1000 }),
  async (c) => {
    const input = tradeSchema.parse(await c.req.json());
    const user = c.get("user");

    const pair = await getTradingPair(input.symbol);
    if (!pair) throw notFound("UNKNOWN_SYMBOL", "El par indicado no existe.");

    const ticker = await getPrice(pair.symbol);
    const price = money(ticker.price);
    if (!price.greaterThan(0)) {
      throw badRequest("NO_MARKET_PRICE", "El mercado no ofrece precio para este par.");
    }

    const paidAmount = money(input.quantity);
    const paidAsset = input.side === "BUY" ? pair.quoteAsset : pair.baseAsset;
    const receivedAsset = input.side === "BUY" ? pair.baseAsset : pair.quoteAsset;

    const fee = paidAmount.times(TRADING_FEE);
    const net = paidAmount.minus(fee);
    const receivedAmount =
      input.side === "BUY" ? net.dividedBy(price) : net.times(price);

    if (!receivedAmount.greaterThan(0)) {
      throw badRequest(
        "AMOUNT_TOO_SMALL",
        "La cantidad es demasiado pequena para ejecutar la operacion.",
      );
    }

    // Cobro, abono y registro comparten transaccion: o cuadra todo o no se
    // aplica nada.
    const trade = await c.get("db").transaction(async (tx) => {
      await debit(
        tx,
        user.id,
        paidAsset,
        paidAmount,
        `No tienes suficiente ${paidAsset}.`,
      );
      await credit(tx, user.id, receivedAsset, receivedAmount);

      const [row] = await tx
        .insert(trades)
        .values({
          userId: user.id,
          symbol: pair.symbol,
          side: input.side,
          paidAsset,
          paidAmount: toStorage(paidAmount),
          receivedAsset,
          receivedAmount: toStorage(receivedAmount),
          fee: toStorage(fee),
          price: toStorage(price),
        })
        .returning();

      return row!;
    });

    return c.json({ trade: toTrade(trade) }, 201);
  },
);

walletRoutes.post(
  "/transfers",
  rateLimit({ name: "transfer", limit: 30, windowMs: 60 * 1000 }),
  async (c) => {
    const input = transferSchema.parse(await c.req.json());
    const user = c.get("user");
    const amount = money(input.amount);

    if (input.recipientId === user.id) {
      throw badRequest("SELF_TRANSFER", "No puedes enviarte dinero a ti mismo.");
    }

    const transfer = await c.get("db").transaction(async (tx) => {
      // Se comprueba que el destinatario existe. Antes se creaba una cartera
      // para cualquier identificador numerico, asi que el dinero enviado a un
      // usuario inexistente simplemente desaparecia.
      const recipient = await tx.query.users.findFirst({
        where: eq(users.id, input.recipientId),
        columns: { id: true },
      });
      if (!recipient) {
        throw notFound("RECIPIENT_NOT_FOUND", "El destinatario no existe.");
      }

      await debit(
        tx,
        user.id,
        SETTLEMENT_ASSET,
        amount,
        `No tienes suficiente ${SETTLEMENT_ASSET}.`,
      );
      await credit(tx, recipient.id, SETTLEMENT_ASSET, amount);

      const [row] = await tx
        .insert(transfers)
        .values({
          senderId: user.id,
          recipientId: recipient.id,
          asset: SETTLEMENT_ASSET,
          amount: toStorage(amount),
        })
        .returning();

      return row!;
    });

    return c.json({ transfer: toTransfer(transfer) }, 201);
  },
);

walletRoutes.post(
  "/deposits",
  rateLimit({ name: "deposit", limit: 20, windowMs: 60 * 1000 }),
  async (c) => {
    const input = paymentSchema.parse(await c.req.json());
    const user = c.get("user");
    const amount = money(input.amount);

    const payment = await c.get("db").transaction(async (tx) => {
      await credit(tx, user.id, SETTLEMENT_ASSET, amount);

      const [row] = await tx
        .insert(payments)
        .values({
          userId: user.id,
          kind: "DEPOSIT",
          asset: SETTLEMENT_ASSET,
          amount: toStorage(amount),
          method: input.method.type,
          methodReference: maskPaymentMethod(input.method),
        })
        .returning();

      return row!;
    });

    return c.json({ payment: toPayment(payment) }, 201);
  },
);

walletRoutes.post(
  "/withdrawals",
  rateLimit({ name: "withdrawal", limit: 20, windowMs: 60 * 1000 }),
  async (c) => {
    const input = paymentSchema.parse(await c.req.json());
    const user = c.get("user");
    const amount = money(input.amount);

    const payment = await c.get("db").transaction(async (tx) => {
      await debit(
        tx,
        user.id,
        SETTLEMENT_ASSET,
        amount,
        "No tienes saldo suficiente para esta retirada.",
      );

      const [row] = await tx
        .insert(payments)
        .values({
          userId: user.id,
          kind: "WITHDRAWAL",
          asset: SETTLEMENT_ASSET,
          amount: toStorage(amount),
          method: input.method.type,
          methodReference: maskPaymentMethod(input.method),
        })
        .returning();

      return row!;
    });

    return c.json({ payment: toPayment(payment) }, 201);
  },
);
