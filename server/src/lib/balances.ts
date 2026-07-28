import { Decimal } from "decimal.js";
import { and, eq, sql } from "drizzle-orm";

import type { Database } from "../db/client";
import { wallets } from "../db/schema";
import { badRequest } from "./errors";
import { toStorage } from "./money";

type Executor = Database | Parameters<Parameters<Database["transaction"]>[0]>[0];

/**
 * Resta un importe del saldo comprobando la disponibilidad dentro de la propia
 * sentencia. Esto es lo que hace imposible el doble gasto: la condicion
 * `quantity >= importe` viaja en el `WHERE` del `UPDATE`, de modo que dos
 * peticiones simultaneas no pueden pasar las dos.
 *
 * La version anterior leia el saldo, comprobaba en JavaScript y escribia
 * despues, con varios `await` por medio y sin transaccion.
 */
export async function debit(
  tx: Executor,
  userId: number,
  asset: string,
  amount: Decimal,
  message: string,
): Promise<void> {
  const value = toStorage(amount);

  const updated = await tx
    .update(wallets)
    .set({ quantity: sql`${wallets.quantity} - ${value}::numeric` })
    .where(
      and(
        eq(wallets.userId, userId),
        eq(wallets.asset, asset),
        sql`${wallets.quantity} >= ${value}::numeric`,
      ),
    )
    .returning({ id: wallets.id });

  if (updated.length === 0) {
    throw badRequest("INSUFFICIENT_BALANCE", message);
  }
}

/** Suma un importe, creando la posicion si el usuario aun no tenia ese activo. */
export async function credit(
  tx: Executor,
  userId: number,
  asset: string,
  amount: Decimal,
): Promise<void> {
  const value = toStorage(amount);

  await tx
    .insert(wallets)
    .values({ userId, asset, quantity: value })
    .onConflictDoUpdate({
      target: [wallets.userId, wallets.asset],
      set: { quantity: sql`${wallets.quantity} + ${value}::numeric` },
    });
}
