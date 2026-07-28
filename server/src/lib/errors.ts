import type { ContentfulStatusCode } from "hono/utils/http-status";

/**
 * Error de negocio con codigo estable. El cliente decide que mensaje mostrar a
 * partir de `code`; `message` es solo un texto de apoyo ya redactado para el
 * usuario final. Nunca se propaga la excepcion original: la version anterior
 * devolvia `Ha ocurrido un error inesperado: ${e}`, filtrando consultas SQL y
 * rutas del servidor a cualquiera que provocase un fallo.
 */
export class ApiError extends Error {
  readonly status: ContentfulStatusCode;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    status: ContentfulStatusCode,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (code: string, message: string, details?: unknown) =>
  new ApiError(400, code, message, details);

export const unauthorized = (message = "Debes iniciar sesion.") =>
  new ApiError(401, "UNAUTHORIZED", message);

export const forbidden = (message = "No tienes permisos para esta accion.") =>
  new ApiError(403, "FORBIDDEN", message);

export const notFound = (code: string, message: string) =>
  new ApiError(404, code, message);

export const conflict = (code: string, message: string) =>
  new ApiError(409, code, message);

export const tooManyRequests = (message: string) =>
  new ApiError(429, "TOO_MANY_REQUESTS", message);

export const badGateway = (code: string, message: string) =>
  new ApiError(502, code, message);
