import { desc, eq, or } from "drizzle-orm";
import { Hono } from "hono";

import { payments, trades, transfers } from "../db/schema";
import { toPayment, toTrade, toTransfer } from "../lib/serializers";
import { requireAuth, type AppEnv } from "./shared";

const MAX_ROWS = 200;

export const historyRoutes = new Hono<AppEnv>();

historyRoutes.use("*", requireAuth);

historyRoutes.get("/trades", async (c) => {
  const rows = await c
    .get("db")
    .select()
    .from(trades)
    .where(eq(trades.userId, c.get("user").id))
    .orderBy(desc(trades.executedAt))
    .limit(MAX_ROWS);

  return c.json({ trades: rows.map(toTrade) });
});

historyRoutes.get("/payments", async (c) => {
  const rows = await c
    .get("db")
    .select()
    .from(payments)
    .where(eq(payments.userId, c.get("user").id))
    .orderBy(desc(payments.createdAt))
    .limit(MAX_ROWS);

  return c.json({ payments: rows.map(toPayment) });
});

historyRoutes.get("/transfers", async (c) => {
  const userId = c.get("user").id;
  const rows = await c
    .get("db")
    .select()
    .from(transfers)
    .where(or(eq(transfers.senderId, userId), eq(transfers.recipientId, userId)))
    .orderBy(desc(transfers.createdAt))
    .limit(MAX_ROWS);

  return c.json({ transfers: rows.map(toTransfer) });
});
