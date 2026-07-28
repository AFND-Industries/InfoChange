/**
 * Unico punto por el que sale una peticion. Antes la URL del servidor se leia
 * en cuatro modulos distintos, cada uno montaba su propia llamada con axios y
 * cualquier fallo -- de red, un 401 o un 500 -- se interpretaba igual: "el
 * servidor no esta disponible", que ademas expulsaba al usuario de la interfaz.
 */

/**
 * Por defecto la API cuelga del mismo origen (`/api`), tanto en Vercel como en
 * desarrollo gracias al proxy de Vite. Solo hace falta definir `VITE_API_URL`
 * si el frontend se aloja aparte.
 */
const BASE_URL = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: ApiErrorDetail[];

  constructor(
    status: number,
    code: string,
    message: string,
    details?: ApiErrorDetail[],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  /** No hubo respuesta del servidor (sin conexion, DNS, CORS). */
  get isNetworkError(): boolean {
    return this.status === 0;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

interface RequestOptions {
  signal?: AbortSignal;
  query?: Record<string, string | number | undefined>;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = `${BASE_URL}${path}`;
  if (!query) return url;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }

  const serialized = params.toString();
  return serialized ? `${url}?${serialized}` : url;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(buildUrl(path, options.query), {
      method,
      // La sesion viaja en una cookie httpOnly.
      credentials: "include",
      headers: body === undefined ? {} : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      "No se ha podido conectar con el servidor.",
    );
  }

  if (response.status === 204) return undefined as T;

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = (payload as { error?: Record<string, unknown> } | null)?.error;
    throw new ApiError(
      response.status,
      typeof detail?.code === "string" ? detail.code : "UNKNOWN_ERROR",
      typeof detail?.message === "string"
        ? detail.message
        : "Se ha producido un error inesperado.",
      Array.isArray(detail?.details)
        ? (detail.details as ApiErrorDetail[])
        : undefined,
    );
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body ?? {}, options),
};
