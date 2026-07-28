import { formatAsset, formatUsd } from "../../../lib/format";

/**
 * Importe de un movimiento. Transferencias y pagos son en USDT salvo excepcion,
 * asi que se muestran como dolares; cualquier otro activo se pinta con su
 * simbolo en lugar de fingir que son dolares.
 */
export function formatAmount(amount, asset) {
    return asset === "USDT" ? formatUsd(amount) : `${formatAsset(amount)} ${asset}`;
}
