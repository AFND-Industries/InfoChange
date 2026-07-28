import { eq } from "drizzle-orm";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import type { Database } from "../src/db/client.js";
import { users } from "../src/db/schema.js";
import {
  createTestDatabase,
  registrationFor,
  resetTestState,
  stubBinance,
  TestClient,
} from "./helpers.js";

let db: Database;
let close: () => Promise<void>;

beforeAll(async () => {
  ({ db, close } = await createTestDatabase());
});

afterAll(async () => {
  await close();
});

beforeEach(() => {
  stubBinance();
});

afterEach(() => {
  resetTestState();
});

async function signUpAdmin(username: string): Promise<TestClient> {
  const client = new TestClient();
  await client.post("/api/auth/register", registrationFor(username));

  // El rol solo se concede desde la base de datos (o desde el script de
  // seeding), nunca desde el formulario de registro.
  await db.update(users).set({ role: "admin" }).where(eq(users.username, username));

  client.clearCookie();
  await client.post("/api/auth/login", {
    username,
    password: registrationFor(username).password,
  });

  return client;
}

describe("panel de administracion", () => {
  it("devuelve metricas agregadas en lugar del volcado de la base de datos", async () => {
    const admin = await signUpAdmin("jefa");

    const user = new TestClient();
    await user.post("/api/auth/register", registrationFor("cliente"));
    await user.post("/api/wallet/trade", {
      symbol: "BTCUSDT",
      quantity: "1000",
      side: "BUY",
    });

    const response = await admin.get("/api/admin/overview");
    expect(response.status).toBe(200);

    const body = response.body;
    expect(body.totals.users).toBeGreaterThanOrEqual(2);
    expect(body.totals.trades).toBe(1);
    expect(Number(body.totals.balanceUsd)).toBeGreaterThan(0);
    expect(Number(body.totals.feesUsd)).toBeCloseTo(0.65, 2);

    expect(body.topUsers.length).toBeGreaterThan(0);
    expect(body.topAssets.length).toBeGreaterThan(0);

    // Lo importante: la respuesta ya no incluye datos personales ni el
    // historial completo de todos los usuarios.
    const serialized = JSON.stringify(body);
    expect(serialized).not.toContain("passwordHash");
    expect(serialized).not.toContain("scrypt");
    expect(serialized).not.toContain("@example.com");
    expect(body).not.toHaveProperty("info");
  });

  it("valora la cartera al precio de mercado", async () => {
    const admin = await signUpAdmin("tasadora");

    const response = await admin.get("/api/admin/overview");
    const topUser = response.body.topUsers[0];

    // Todas las cuentas empiezan con 10.000 USDT, valorados a 1 dolar.
    expect(Number(topUser.balanceUsd)).toBeGreaterThanOrEqual(10_000);
  });

  it("incluye las ultimas transferencias con los nombres ya resueltos", async () => {
    const admin = await signUpAdmin("supervisora");

    const sender = new TestClient();
    const senderResponse = await sender.post(
      "/api/auth/register",
      registrationFor("origen"),
    );
    const recipient = new TestClient();
    const recipientResponse = await recipient.post(
      "/api/auth/register",
      registrationFor("destinatario"),
    );

    await sender.post("/api/wallet/transfers", {
      recipientId: recipientResponse.body.user.id,
      amount: "42",
    });

    const response = await admin.get("/api/admin/overview");
    const transfer = response.body.recentTransfers[0];

    expect(transfer.sender).toBe("origen");
    expect(transfer.recipient).toBe("destinatario");
    expect(Number(transfer.amount)).toBe(42);
    expect(senderResponse.body.user.id).not.toBe(recipientResponse.body.user.id);
  });
});
