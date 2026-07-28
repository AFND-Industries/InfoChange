import { sql } from "drizzle-orm";

import { hashPassword } from "../lib/password.js";
import type { Database } from "./client.js";
import * as schema from "./schema.js";
import { SECURITY_QUESTIONS } from "./seed-data.js";

export interface AdminSeed {
  username: string;
  email: string;
  password: string;
  /**
   * Cambia tambien la contrasena si la cuenta ya existe. Por defecto no se
   * toca: el uso habitual de este script sobre una cuenta existente es
   * ascender a administrador a alguien que se registro por la web, y ahi
   * pisarle la contrasena seria justo lo contrario de lo que se quiere.
   */
  resetPassword?: boolean;
}

export interface SeedResult {
  questions: number;
  admin: "creado" | "rol-concedido" | "contrasena-actualizada" | "omitido";
}

/**
 * Logica de inicializacion, separada del script de linea de comandos para poder
 * probarla: crear la cuenta de administrador es el paso donde un error deja al
 * dueno del proyecto sin poder entrar a su propio panel.
 */
export async function seedDatabase(
  db: Database,
  admin?: AdminSeed,
): Promise<SeedResult> {
  await db
    .insert(schema.securityQuestions)
    .values(SECURITY_QUESTIONS.map((prompt) => ({ prompt })))
    .onConflictDoNothing();

  if (!admin) {
    return { questions: SECURITY_QUESTIONS.length, admin: "omitido" };
  }

  if (admin.password.length < 12) {
    throw new Error(
      `ADMIN_PASSWORD tiene ${admin.password.length} caracteres y necesita al menos 12. ` +
        "Se pide mas que a una cuenta normal (10) porque esta lee las metricas de todo el exchange.",
    );
  }

  const [question] = await db.select().from(schema.securityQuestions).limit(1);

  const [created] = await db
    .insert(schema.users)
    .values({
      username: admin.username,
      email: admin.email.toLowerCase(),
      passwordHash: await hashPassword(admin.password),
      role: "admin",
      firstName: "Admin",
      lastName: "InfoChange",
      birthDate: "1990-01-01",
      gender: "other",
      securityQuestionId: question?.id,
      securityAnswerHash: await hashPassword("infochange"),
      address: "-",
      city: "Malaga",
      zipCode: "29010",
      country: "España",
      phone: "-",
      documentId: "-",
    })
    .onConflictDoNothing()
    .returning();

  if (created) {
    await db
      .insert(schema.wallets)
      .values({ userId: created.id, asset: "USDT", quantity: "100000" })
      .onConflictDoNothing();

    return { questions: SECURITY_QUESTIONS.length, admin: "creado" };
  }

  // La cuenta ya existia: se le concede el rol y, solo si se pide de forma
  // explicita, se le cambia la contrasena.
  await db
    .update(schema.users)
    .set({
      role: "admin",
      ...(admin.resetPassword
        ? { passwordHash: await hashPassword(admin.password) }
        : {}),
    })
    .where(sql`lower(${schema.users.username}) = ${admin.username.toLowerCase()}`);

  return {
    questions: SECURITY_QUESTIONS.length,
    admin: admin.resetPassword ? "contrasena-actualizada" : "rol-concedido",
  };
}
