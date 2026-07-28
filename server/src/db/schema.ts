import { relations, sql } from "drizzle-orm";
import {
  check,
  date,
  index,
  integer,
  numeric,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Todos los importes se guardan como `numeric` y nunca como coma flotante: los
 * saldos de la version anterior derivaban porque se sumaban `REAL` de SQLite y
 * ademas a veces se escribian como cadena. `numeric(38, 18)` cubre de sobra
 * tanto un saldo en USDT como las 8 cifras decimales tipicas de una cripto.
 */
const amount = (name: string) => numeric(name, { precision: 38, scale: 18 });

export const securityQuestions = pgTable("security_questions", {
  id: serial("id").primaryKey(),
  prompt: text("prompt").notNull(),
});

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: text("username").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    // 'user' | 'admin'. Antes ser administrador consistia en llamarse "admin",
    // de modo que cualquiera podia registrarse y leer la base de datos entera.
    role: text("role").notNull().default("user"),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    birthDate: date("birth_date").notNull(),
    gender: text("gender").notNull(),
    securityQuestionId: integer("security_question_id").references(
      () => securityQuestions.id,
    ),
    // La respuesta secreta se guarda hasheada, igual que la contrasena.
    securityAnswerHash: text("security_answer_hash"),
    address: text("address").notNull(),
    city: text("city").notNull(),
    zipCode: text("zip_code").notNull(),
    country: text("country").notNull(),
    phone: text("phone").notNull(),
    documentId: text("document_id").notNull(),
    // 0 = novato, 1 = avanzado. Solo cambia la densidad de la interfaz.
    uiMode: smallint("ui_mode").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("users_username_unique").on(sql`lower(${table.username})`),
    uniqueIndex("users_email_unique").on(sql`lower(${table.email})`),
    check("users_role_check", sql`${table.role} in ('user', 'admin')`),
  ],
);

export const wallets = pgTable(
  "wallets",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    asset: text("asset").notNull(),
    quantity: amount("quantity").notNull().default("0"),
  },
  (table) => [
    uniqueIndex("wallets_user_asset_unique").on(table.userId, table.asset),
    // Una posicion negativa siempre es un error de contabilidad. Con esto la
    // base de datos rechaza la escritura aunque el codigo se equivoque.
    check("wallets_quantity_non_negative", sql`${table.quantity} >= 0`),
  ],
);

export const trades = pgTable(
  "trades",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    symbol: text("symbol").notNull(),
    side: text("side").notNull(),
    paidAsset: text("paid_asset").notNull(),
    paidAmount: amount("paid_amount").notNull(),
    receivedAsset: text("received_asset").notNull(),
    receivedAmount: amount("received_amount").notNull(),
    fee: amount("fee").notNull(),
    price: amount("price").notNull(),
    executedAt: timestamp("executed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("trades_user_idx").on(table.userId, table.executedAt),
    check("trades_side_check", sql`${table.side} in ('BUY', 'SELL')`),
    check("trades_paid_amount_positive", sql`${table.paidAmount} > 0`),
  ],
);

export const transfers = pgTable(
  "transfers",
  {
    id: serial("id").primaryKey(),
    senderId: integer("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recipientId: integer("recipient_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    asset: text("asset").notNull().default("USDT"),
    amount: amount("amount").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("transfers_sender_idx").on(table.senderId, table.createdAt),
    index("transfers_recipient_idx").on(table.recipientId, table.createdAt),
    check("transfers_amount_positive", sql`${table.amount} > 0`),
    check("transfers_not_self", sql`${table.senderId} <> ${table.recipientId}`),
  ],
);

export const payments = pgTable(
  "payments",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    asset: text("asset").notNull().default("USDT"),
    amount: amount("amount").notNull(),
    method: text("method").notNull(),
    // Solo una referencia enmascarada ("**** 4242"). La version anterior
    // guardaba el numero de tarjeta, el CVV y hasta la contrasena de PayPal.
    methodReference: text("method_reference"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("payments_user_idx").on(table.userId, table.createdAt),
    check("payments_kind_check", sql`${table.kind} in ('DEPOSIT', 'WITHDRAWAL')`),
    check("payments_amount_positive", sql`${table.amount} > 0`),
  ],
);

export const usersRelations = relations(users, ({ many, one }) => ({
  wallets: many(wallets),
  trades: many(trades),
  payments: many(payments),
  sentTransfers: many(transfers, { relationName: "sender" }),
  receivedTransfers: many(transfers, { relationName: "recipient" }),
  securityQuestion: one(securityQuestions, {
    fields: [users.securityQuestionId],
    references: [securityQuestions.id],
  }),
}));

export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users, { fields: [wallets.userId], references: [users.id] }),
}));

export const tradesRelations = relations(trades, ({ one }) => ({
  user: one(users, { fields: [trades.userId], references: [users.id] }),
}));

export const transfersRelations = relations(transfers, ({ one }) => ({
  sender: one(users, {
    fields: [transfers.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  recipient: one(users, {
    fields: [transfers.recipientId],
    references: [users.id],
    relationName: "recipient",
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Wallet = typeof wallets.$inferSelect;
export type Trade = typeof trades.$inferSelect;
export type Transfer = typeof transfers.$inferSelect;
export type Payment = typeof payments.$inferSelect;
