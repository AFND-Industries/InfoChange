import { Decimal } from "decimal.js";

/**
 * Toda la aritmetica de saldos pasa por aqui. La version anterior operaba con
 * `Number`, redondeaba con `toFixed(8)` y en un punto llegaba a guardar la
 * cantidad como cadena, asi que los saldos acumulaban error en cada operacion.
 */
Decimal.set({ precision: 40, rounding: Decimal.ROUND_DOWN, toExpNeg: -30, toExpPos: 40 });

/** Decimales que se conservan al persistir. Coincide con `numeric(38, 18)`. */
export const SCALE = 18;

export type MoneyInput = string | number | Decimal;

export const money = (value: MoneyInput): Decimal => new Decimal(value);

export const isPositive = (value: Decimal): boolean => value.greaterThan(0);

/**
 * Serializa para la base de datos truncando (nunca redondeando hacia arriba:
 * redondear al alza en un saldo es crear dinero de la nada).
 */
export const toStorage = (value: Decimal): string =>
  value.toDecimalPlaces(SCALE, Decimal.ROUND_DOWN).toFixed();

/** Representacion para la API: cadena, para no perder precision en JSON. */
export const toApi = (value: MoneyInput): string => money(value).toFixed();

/**
 * Convierte una cantidad recibida del cliente y falla si no es un numero finito
 * y estrictamente positivo. Antes `/withdraw` aceptaba cantidades negativas, con
 * lo que retirar -100 USDT sumaba 100 USDT al saldo.
 */
export function parseAmount(raw: unknown): Decimal | null {
  if (typeof raw !== "string" && typeof raw !== "number") return null;

  let value: Decimal;
  try {
    value = new Decimal(raw);
  } catch {
    return null;
  }

  if (!value.isFinite() || value.lessThanOrEqualTo(0)) return null;
  return value;
}
