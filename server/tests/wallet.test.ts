import { eq } from "drizzle-orm";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import type { Database } from "../src/db/client";
import { users, wallets } from "../src/db/schema";
import {
  createTestDatabase,
  registrationFor,
  resetTestState,
  stubBinance,
  TestClient,
} from "./helpers";

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

const CARD = {
  type: "CARD" as const,
  holder: "Ada Lovelace",
  number: "4111111111111111",
  expiry: "12/30",
  cvv: "123",
};

/** Crea una cuenta y devuelve un cliente con la sesion abierta. */
async function signUp(username: string): Promise<{ client: TestClient; id: number }> {
  const client = new TestClient();
  const response = await client.post("/api/auth/register", registrationFor(username));
  expect(response.status).toBe(201);
  return { client, id: response.body.user.id };
}

async function balanceOf(userId: number, asset: string): Promise<string> {
  const rows = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, userId));
  return rows.find((row) => row.asset === asset)?.quantity ?? "0";
}

describe("ingresos", () => {
  it("abona el importe y guarda solo una referencia enmascarada del medio de pago", async () => {
    const { client, id } = await signUp("ingreso");

    const response = await client.post("/api/wallet/deposits", {
      amount: "500",
      method: CARD,
    });

    expect(response.status).toBe(201);
    expect(response.body.payment.kind).toBe("DEPOSIT");
    // Lo critico: ni el numero completo ni el CVV llegan a la base de datos.
    expect(response.body.payment.methodReference).toBe("**** **** **** 1111");
    expect(JSON.stringify(response.body)).not.toContain("4111111111111111");
    expect(JSON.stringify(response.body)).not.toContain("123");

    expect(Number(await balanceOf(id, "USDT"))).toBe(10_500);
  });

  it("rechaza importes no positivos", async () => {
    const { client } = await signUp("ingresomalo");

    for (const amount of ["0", "-100", "abc", ""]) {
      const response = await client.post("/api/wallet/deposits", {
        amount,
        method: CARD,
      });
      expect(response.status).toBe(400);
    }
  });

  it("rechaza una tarjeta con formato invalido", async () => {
    const { client } = await signUp("tarjetamala");

    const response = await client.post("/api/wallet/deposits", {
      amount: "100",
      method: { ...CARD, number: "1234" },
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("retiradas", () => {
  it("descuenta el importe", async () => {
    const { client, id } = await signUp("retirada");

    const response = await client.post("/api/wallet/withdrawals", {
      amount: "2500",
      method: CARD,
    });

    expect(response.status).toBe(201);
    expect(Number(await balanceOf(id, "USDT"))).toBe(7500);
  });

  it("no permite retirar una cantidad negativa", async () => {
    const { client, id } = await signUp("negativa");
    const before = await balanceOf(id, "USDT");

    // En la version anterior `cart.quantity = -100` pasaba la comprobacion
    // `wallet.quantity < cart.quantity` y el saldo terminaba SUBIENDO 100.
    const response = await client.post("/api/wallet/withdrawals", {
      amount: "-100",
      method: CARD,
    });

    expect(response.status).toBe(400);
    expect(await balanceOf(id, "USDT")).toBe(before);
  });

  it("no permite retirar mas saldo del disponible", async () => {
    const { client, id } = await signUp("sinsaldo");

    const response = await client.post("/api/wallet/withdrawals", {
      amount: "999999",
      method: CARD,
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INSUFFICIENT_BALANCE");
    expect(Number(await balanceOf(id, "USDT"))).toBe(10_000);
  });
});

describe("operaciones de compraventa", () => {
  it("compra descontando la comision del importe pagado", async () => {
    const { client, id } = await signUp("compra");

    const response = await client.post("/api/wallet/trade", {
      symbol: "BTCUSDT",
      quantity: "1000",
      side: "BUY",
    });

    expect(response.status).toBe(201);

    // 1000 USDT, comision 0,065 % = 0,65; quedan 999,35 a 50.000 USDT/BTC.
    const trade = response.body.trade;
    expect(Number(trade.fee)).toBeCloseTo(0.65, 10);
    expect(Number(trade.receivedAmount)).toBeCloseTo(999.35 / 50_000, 12);
    expect(trade.paidAsset).toBe("USDT");
    expect(trade.receivedAsset).toBe("BTC");

    expect(Number(await balanceOf(id, "USDT"))).toBe(9000);
    expect(Number(await balanceOf(id, "BTC"))).toBeCloseTo(999.35 / 50_000, 12);
  });

  it("vende multiplicando por el precio", async () => {
    const { client, id } = await signUp("venta");
    await client.post("/api/wallet/trade", {
      symbol: "BTCUSDT",
      quantity: "5000",
      side: "BUY",
    });

    const btc = Number(await balanceOf(id, "BTC"));
    const response = await client.post("/api/wallet/trade", {
      symbol: "BTCUSDT",
      quantity: btc.toFixed(8),
      side: "SELL",
    });

    expect(response.status).toBe(201);
    expect(response.body.trade.paidAsset).toBe("BTC");
    expect(response.body.trade.receivedAsset).toBe("USDT");
    expect(Number(response.body.trade.receivedAmount)).toBeGreaterThan(4900);
  });

  it("rechaza un simbolo inexistente sin reventar", async () => {
    const { client } = await signUp("simbolomalo");

    // Antes `Symbols.symbols.find(...)` devolvia undefined y la linea siguiente
    // leia `.length` fuera del try, provocando un 500 sin controlar.
    const response = await client.post("/api/wallet/trade", {
      symbol: "NOEXISTE",
      quantity: "10",
      side: "BUY",
    });

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("UNKNOWN_SYMBOL");
  });

  it("no deja comprar sin saldo suficiente", async () => {
    const { client, id } = await signUp("sinfondos");

    const response = await client.post("/api/wallet/trade", {
      symbol: "BTCUSDT",
      quantity: "50000",
      side: "BUY",
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INSUFFICIENT_BALANCE");
    expect(Number(await balanceOf(id, "USDT"))).toBe(10_000);
  });

  it("no registra la operacion si el cobro falla", async () => {
    const { client, id } = await signUp("atomico");

    await client.post("/api/wallet/trade", {
      symbol: "BTCUSDT",
      quantity: "999999",
      side: "BUY",
    });

    const history = await client.get("/api/history/trades");
    expect(history.body.trades).toHaveLength(0);
    expect(Number(await balanceOf(id, "BTC"))).toBe(0);
  });
});

describe("transferencias entre usuarios", () => {
  it("mueve el saldo de un usuario a otro", async () => {
    const { client, id: senderId } = await signUp("emisor");
    const { id: recipientId } = await signUp("receptor");

    const response = await client.post("/api/wallet/transfers", {
      recipientId,
      amount: "250.5",
    });

    expect(response.status).toBe(201);
    expect(Number(await balanceOf(senderId, "USDT"))).toBe(9749.5);
    expect(Number(await balanceOf(recipientId, "USDT"))).toBe(10_250.5);
  });

  it("rechaza un destinatario inexistente sin perder el dinero", async () => {
    const { client, id } = await signUp("aldesconocido");

    // Antes se creaba una cartera para cualquier id numerico, asi que el dinero
    // enviado a un usuario que no existia desaparecia del sistema.
    const response = await client.post("/api/wallet/transfers", {
      recipientId: 999_999,
      amount: "100",
    });

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("RECIPIENT_NOT_FOUND");
    expect(Number(await balanceOf(id, "USDT"))).toBe(10_000);
  });

  it("no permite enviarse dinero a uno mismo", async () => {
    const { client, id } = await signUp("automismo");

    const response = await client.post("/api/wallet/transfers", {
      recipientId: id,
      amount: "100",
    });

    expect(response.status).toBe(400);
    expect(Number(await balanceOf(id, "USDT"))).toBe(10_000);
  });

  it("no permite transferir mas de lo que se tiene", async () => {
    const { client, id } = await signUp("pobre");
    const { id: otherId } = await signUp("rico");

    const response = await client.post("/api/wallet/transfers", {
      recipientId: otherId,
      amount: "20000",
    });

    expect(response.status).toBe(400);
    expect(Number(await balanceOf(id, "USDT"))).toBe(10_000);
    expect(Number(await balanceOf(otherId, "USDT"))).toBe(10_000);
  });
});

describe("concurrencia", () => {
  it("no permite gastar el mismo saldo dos veces", async () => {
    const { client, id } = await signUp("carrera");
    const { id: recipientId } = await signUp("destino");

    // Diez peticiones simultaneas de 2.000 USDT sobre un saldo de 10.000: como
    // maximo deben cuadrar cinco. La version anterior leia el saldo, comprobaba
    // en JavaScript y escribia despues, sin transaccion, asi que podian pasar
    // las diez y dejar el saldo en negativo.
    const results = await Promise.all(
      Array.from({ length: 10 }, () =>
        client.post("/api/wallet/transfers", { recipientId, amount: "2000" }),
      ),
    );

    const accepted = results.filter((response) => response.status === 201).length;
    expect(accepted).toBeLessThanOrEqual(5);

    const senderBalance = Number(await balanceOf(id, "USDT"));
    expect(senderBalance).toBeGreaterThanOrEqual(0);
    expect(senderBalance).toBe(10_000 - accepted * 2000);
    expect(Number(await balanceOf(recipientId, "USDT"))).toBe(
      10_000 + accepted * 2000,
    );
  });

  it("mantiene el total del sistema constante tras operaciones simultaneas", async () => {
    const { client: a, id: idA } = await signUp("cuentaA");
    const { client: b, id: idB } = await signUp("cuentaB");

    await Promise.all([
      ...Array.from({ length: 5 }, () =>
        a.post("/api/wallet/transfers", { recipientId: idB, amount: "100" }),
      ),
      ...Array.from({ length: 5 }, () =>
        b.post("/api/wallet/transfers", { recipientId: idA, amount: "100" }),
      ),
    ]);

    const total =
      Number(await balanceOf(idA, "USDT")) + Number(await balanceOf(idB, "USDT"));
    expect(total).toBe(20_000);
  });
});

describe("destinatarios", () => {
  it("busca por nombre o usuario y excluye al propio usuario", async () => {
    const { client, id } = await signUp("buscador");
    await signUp("objetivo");

    const all = await client.get("/api/wallet/recipients");
    expect(all.status).toBe(200);
    expect(all.body.recipients.some((r: { id: number }) => r.id === id)).toBe(false);

    // Antes esta ruta era publica y devolvia siempre los mismos 10 usuarios,
    // sin filtro alguno.
    const filtered = await client.get("/api/wallet/recipients?q=objet");
    expect(filtered.body.recipients).toHaveLength(1);
    expect(filtered.body.recipients[0].username).toBe("objetivo");
  });
});

describe("saldos", () => {
  it("solo lista posiciones con saldo", async () => {
    const { client } = await signUp("posiciones");
    await client.post("/api/wallet/trade", {
      symbol: "BTCUSDT",
      quantity: "10000",
      side: "BUY",
    });

    const response = await client.get("/api/wallet");
    const assets = response.body.balances.map((b: { asset: string }) => b.asset);

    expect(assets).toContain("BTC");
    expect(assets).not.toContain("USDT");
  });

  it("guarda el usuario correcto en cada cartera", async () => {
    const { id: idA } = await signUp("aislamientoA");
    const { client: b } = await signUp("aislamientoB");

    await b.post("/api/wallet/deposits", { amount: "777", method: CARD });

    const rowsA = await db.select().from(wallets).where(eq(wallets.userId, idA));
    expect(rowsA.every((row) => Number(row.quantity) === 10_000)).toBe(true);

    const everyone = await db.select().from(users);
    expect(everyone.length).toBeGreaterThan(1);
  });
});
