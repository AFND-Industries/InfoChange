import type { Context, ErrorHandler, NotFoundHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

import { isProduction } from "../env";
import { ApiError } from "../lib/errors";
import type { AppEnv } from "../types";

export interface ErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Unico punto donde se convierte una excepcion en respuesta. Solo salen al
 * exterior los errores declarados como `ApiError`; cualquier otra cosa se
 * registra en el servidor y se responde con un mensaje generico, para no
 * filtrar consultas SQL, rutas de ficheros ni trazas.
 */
export const onError: ErrorHandler<AppEnv> = (error, c) => {
  if (error instanceof ApiError) {
    return c.json<ErrorBody>(
      { error: { code: error.code, message: error.message, details: error.details } },
      error.status,
    );
  }

  if (error instanceof ZodError) {
    return c.json<ErrorBody>(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Los datos enviados no son validos.",
          details: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      },
      400,
    );
  }

  if (error instanceof HTTPException) {
    return c.json<ErrorBody>(
      { error: { code: "HTTP_ERROR", message: error.message } },
      error.status,
    );
  }

  console.error("[infochange] error no controlado", {
    path: c.req.path,
    method: c.req.method,
    error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
  });

  return c.json<ErrorBody>(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Se ha producido un error inesperado.",
        // En desarrollo si interesa ver la causa sin abrir los logs.
        details: isProduction() ? undefined : String(error),
      },
    },
    500,
  );
};

export const onNotFound: NotFoundHandler<AppEnv> = (c: Context) =>
  c.json<ErrorBody>(
    { error: { code: "NOT_FOUND", message: "El recurso solicitado no existe." } },
    404,
  );
