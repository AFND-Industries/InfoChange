import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { jwtVerify, SignJWT } from "jose";

import { env, isProduction } from "../env";

export const SESSION_COOKIE = "infochange_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const ISSUER = "infochange";

export interface SessionClaims {
  userId: number;
  role: "user" | "admin";
}

let secretKey: Uint8Array | undefined;

function key(): Uint8Array {
  secretKey ??= new TextEncoder().encode(env().SESSION_SECRET);
  return secretKey;
}

export function resetSessionKeyCache(): void {
  secretKey = undefined;
}

export async function createSessionToken(claims: SessionClaims): Promise<string> {
  return new SignJWT({ role: claims.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(claims.userId))
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(key());
}

export async function readSessionToken(
  token: string,
): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, key(), { issuer: ISSUER });
    const userId = Number(payload.sub);
    const role = payload.role;

    if (!Number.isInteger(userId) || userId <= 0) return null;
    if (role !== "user" && role !== "admin") return null;

    return { userId, role };
  } catch {
    // Firma invalida, token caducado o manipulado: se trata como "sin sesion".
    return null;
  }
}

/**
 * La sesion viaja en una cookie `httpOnly` para que JavaScript no pueda leerla,
 * y con `SameSite=Lax` para que el navegador no la adjunte en peticiones
 * cruzadas: eso cubre el CSRF de todas las rutas que modifican estado, que
 * ademas son todas POST/PATCH (antes `/logout` era un GET y bastaba con
 * incrustar una imagen para cerrar la sesion de cualquier visitante).
 */
export function setSessionCookie(c: Context, token: string): void {
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "Lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(c: Context): void {
  deleteCookie(c, SESSION_COOKIE, { path: "/" });
}

/**
 * Acepta tambien `Authorization: Bearer` porque la aplicacion Android empaqueta
 * el frontend con Capacitor y lo sirve desde un origen propio, donde el
 * navegador embebido no adjunta la cookie de sesion.
 */
export async function readSession(c: Context): Promise<SessionClaims | null> {
  const header = c.req.header("Authorization");
  if (header?.startsWith("Bearer ")) {
    const claims = await readSessionToken(header.slice(7).trim());
    if (claims) return claims;
  }

  const cookie = getCookie(c, SESSION_COOKIE);
  return cookie ? readSessionToken(cookie) : null;
}
