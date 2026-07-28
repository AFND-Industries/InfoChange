/**
 * Formateo de cifras y fechas. Los importes llegan de la API como cadena para
 * no perder precision, asi que se convierten a numero solo aqui, ya para pintar.
 */

const currency = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const dateTime = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "short",
  timeStyle: "short",
});

const dateOnly = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });

export const formatUsd = (value: string | number): string =>
  currency.format(Number(value));

/** Cantidad de cripto: hasta 8 decimales, sin ceros de relleno. */
export function formatAsset(value: string | number, decimals = 8): string {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "0";

  return numeric.toLocaleString("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function formatPrice(value: string | number, decimalPlaces?: number): string {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "-";

  // Sin indicacion explicita, se ajusta la precision a la magnitud: 0,00001234
  // necesita mas decimales que 63.701,86.
  const decimals =
    decimalPlaces ?? (numeric >= 1000 ? 2 : numeric >= 1 ? 4 : 8);

  return numeric.toLocaleString("es-ES", {
    minimumFractionDigits: Math.min(2, decimals),
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(value: string | number): string {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "-";
  return `${numeric > 0 ? "+" : ""}${numeric.toFixed(2)} %`;
}

export const formatDateTime = (value: string): string =>
  dateTime.format(new Date(value));

export const formatDate = (value: string): string => dateOnly.format(new Date(value));

/** Suma el contravalor en dolares de todas las posiciones de la cartera. */
export function totalBalanceUsd(
  balances: Array<{ asset: string; quantity: string }>,
  priceOf: (asset: string) => number,
): number {
  return balances.reduce(
    (total, balance) => total + Number(balance.quantity) * priceOf(balance.asset),
    0,
  );
}
