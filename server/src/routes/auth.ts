import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";

import { securityQuestions, users, wallets } from "../db/schema.js";
import { conflict, unauthorized } from "../lib/errors.js";
import { burnPasswordComparison, hashPassword, verifyPassword } from "../lib/password.js";
import { rateLimit } from "../lib/rate-limit.js";
import { toBalance, toPublicUser } from "../lib/serializers.js";
import {
  clearSessionCookie,
  createSessionToken,
  setSessionCookie,
} from "../lib/session.js";
import { checkEmailSchema, loginSchema, registerSchema } from "../schemas.js";
import { requireAuth, type AppEnv } from "./shared.js";

/** Saldo de bienvenida para que la cuenta sea utilizable desde el primer minuto. */
const WELCOME_BALANCE = "10000";

export const authRoutes = new Hono<AppEnv>();

authRoutes.get("/security-questions", async (c) => {
  const questions = await c.get("db").select().from(securityQuestions);
  c.header("Cache-Control", "public, max-age=3600");
  return c.json({ questions });
});

authRoutes.post(
  "/register",
  rateLimit({ name: "register", limit: 10, windowMs: 60 * 60 * 1000 }),
  async (c) => {
    const input = registerSchema.parse(await c.req.json());
    const db = c.get("db");

    // El alta y el saldo de bienvenida van juntos: una cuenta sin cartera
    // dejaria al usuario sin poder operar y sin forma evidente de arreglarlo.
    const user = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(users)
        .values({
          username: input.username,
          email: input.email,
          passwordHash: await hashPassword(input.password),
          firstName: input.firstName,
          lastName: input.lastName,
          birthDate: input.birthDate,
          gender: input.gender,
          securityQuestionId: input.securityQuestionId,
          securityAnswerHash: await hashPassword(input.securityAnswer.toLowerCase()),
          address: input.address,
          city: input.city,
          zipCode: input.zipCode,
          country: input.country,
          phone: input.phone,
          documentId: input.documentId,
        })
        // Los indices unicos sobre `lower(username)` y `lower(email)` son la
        // unica comprobacion fiable: mirar antes y escribir despues deja una
        // ventana en la que dos altas simultaneas pasan las dos.
        .onConflictDoNothing()
        .returning();

      if (!created) {
        throw conflict(
          "ACCOUNT_EXISTS",
          "Ya existe una cuenta con ese usuario o correo electronico.",
        );
      }

      await tx
        .insert(wallets)
        .values({ userId: created.id, asset: "USDT", quantity: WELCOME_BALANCE });

      return created;
    });

    const token = await createSessionToken({
      userId: user.id,
      role: user.role as "user" | "admin",
    });
    setSessionCookie(c, token);

    return c.json(
      {
        user: toPublicUser(user),
        balances: [{ asset: "USDT", quantity: WELCOME_BALANCE }],
        token,
      },
      201,
    );
  },
);

authRoutes.post(
  "/login",
  rateLimit({
    name: "login",
    limit: 10,
    windowMs: 15 * 60 * 1000,
    message: "Demasiados intentos de acceso. Espera unos minutos.",
  }),
  async (c) => {
    const { username, password } = loginSchema.parse(await c.req.json());
    const db = c.get("db");

    // Se admite usuario o correo, comparando en minusculas contra el mismo
    // indice unico. La version anterior usaba LIKE, asi que un usuario podia
    // entrar escribiendo `%` en el nombre.
    const identifier = username.toLowerCase();
    const user = await db.query.users.findFirst({
      where: sql`lower(${users.username}) = ${identifier} or lower(${users.email}) = ${identifier}`,
    });

    if (!user) {
      // Se gasta el mismo tiempo que en una verificacion real para que la
      // duracion de la respuesta no revele si la cuenta existe.
      await burnPasswordComparison(password);
      throw unauthorized("Usuario o contrasena incorrectos.");
    }

    if (!(await verifyPassword(password, user.passwordHash))) {
      throw unauthorized("Usuario o contrasena incorrectos.");
    }

    const balances = await db
      .select({ asset: wallets.asset, quantity: wallets.quantity })
      .from(wallets)
      .where(eq(wallets.userId, user.id));

    const token = await createSessionToken({
      userId: user.id,
      role: user.role as "user" | "admin",
    });
    setSessionCookie(c, token);

    return c.json({
      user: toPublicUser(user),
      balances: balances.map(toBalance),
      token,
    });
  },
);

authRoutes.post("/logout", (c) => {
  clearSessionCookie(c);
  return c.json({ ok: true });
});

/**
 * Sesion y saldos en una sola respuesta. El frontend necesitaba las dos cosas
 * a la vez y hacia dos peticiones separadas cada cinco segundos.
 *
 * Que no haya sesion no es un error, es una respuesta: devuelve 200 con
 * `user: null`. Con 401 el cliente trataba "visitante anonimo" como un fallo,
 * y eso ademas llenaba la consola del navegador de errores en cada visita.
 */
authRoutes.get("/me", async (c) => {
  const session = c.get("session");
  if (!session) return c.json({ user: null, balances: [] });

  const db = c.get("db");
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  // El token puede seguir siendo valido despues de borrar la cuenta.
  if (!user) {
    clearSessionCookie(c);
    return c.json({ user: null, balances: [] });
  }

  const balances = await db
    .select({ asset: wallets.asset, quantity: wallets.quantity })
    .from(wallets)
    .where(eq(wallets.userId, user.id));

  return c.json({ user: toPublicUser(user), balances: balances.map(toBalance) });
});

/** Alterna entre la interfaz reducida y la avanzada. */
authRoutes.post("/me/ui-mode", requireAuth, async (c) => {
  const user = c.get("user");
  const [updated] = await c
    .get("db")
    .update(users)
    .set({ uiMode: user.uiMode === 0 ? 1 : 0 })
    .where(eq(users.id, user.id))
    .returning();

  return c.json({ user: toPublicUser(updated!) });
});

authRoutes.post(
  "/check-email",
  rateLimit({ name: "check-email", limit: 30, windowMs: 10 * 60 * 1000 }),
  async (c) => {
    const { email } = checkEmailSchema.parse(await c.req.json());

    // `findAndCountAll` devolvia un objeto y se comparaba con `> 0`, de modo
    // que esta comprobacion siempre respondia "disponible".
    const existing = await c
      .get("db")
      .query.users.findFirst({
        where: sql`lower(${users.email}) = ${email}`,
        columns: { id: true },
      });

    return c.json({ available: !existing });
  },
);
