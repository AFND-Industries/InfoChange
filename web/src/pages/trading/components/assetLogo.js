/**
 * Logo de un activo. El catalogo de tokens no cubre todos los pares que ofrece
 * el mercado, asi que puede no haber ficha (o la imagen puede fallar) y hace
 * falta un recambio.
 */

export const FALLBACK_LOGO = "/favicon.ico";

export const logoUrl = (token) => token?.logo ?? FALLBACK_LOGO;

/** Evita el bucle de errores si tampoco se puede cargar el recambio. */
export function handleLogoError(event) {
  const image = event.currentTarget;
  if (!image.src.endsWith(FALLBACK_LOGO)) image.src = FALLBACK_LOGO;
}
