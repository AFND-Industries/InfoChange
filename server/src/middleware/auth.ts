import { eq } from "drizzle-orm";
import type { MiddlewareHandler } from "hono";

import { users } from "../db/schema.js";
import { forbidden, unauthorized } from "../lib/errors.js";
import { readSession } from "../lib/session.js";
import type { AppEnv } from "../types.js";

/** Lee la sesion si existe, sin exigirla. */
export const withSession: MiddlewareHandler<AppEnv> = async (c, next) => {
  c.set("session", await readSession(c));
  await next();
};

/**
 * Exige sesion valida y carga el usuario desde la base de datos en cada
 * peticion. La version anterior guardaba la fila entera del usuario dentro de
 * la sesion en memoria, incluido el hash de la contrasena, y la devolvia tal
 * cual en `/auth`; ademas los datos quedaban congelados hasta cerrar sesion.
 */
export const requireAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
  const session = c.get("session");
  if (!session) throw unauthorized();

  const user = await c
    .get("db")
    .query.users.findFirst({ where: eq(users.id, session.userId) });

  // El token puede seguir siendo criptograficamente valido despues de borrar la
  // cuenta, asi que la existencia se comprueba siempre contra la base de datos.
  if (!user) throw unauthorized("La sesion ya no es valida.");

  c.set("user", user);
  await next();
};

export const requireAdmin: MiddlewareHandler<AppEnv> = async (c, next) => {
  if (c.get("user").role !== "admin") throw forbidden();
  await next();
};
