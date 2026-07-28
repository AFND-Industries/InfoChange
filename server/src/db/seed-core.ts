import { sql } from "drizzle-orm";

import { hashPassword } from "../lib/password";
import type { Database } from "./client";
import * as schema from "./schema";
import { SECURITY_QUESTIONS } from "./seed-data";

export interface AdminSeed {
  username: string;
  email: string;
  password: string;
}

export interface SeedResult {
  questions: number;
  admin: "creado" | "actualizado" | "omitido";
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
    throw new Error("La contrasena del administrador debe tener 12 caracteres o mas.");
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

  // La cuenta ya existia: se le asegura el rol sin tocar su contrasena, para
  // poder promover a administrador a alguien que se registro por la web.
  await db
    .update(schema.users)
    .set({ role: "admin" })
    .where(sql`lower(${schema.users.username}) = ${admin.username.toLowerCase()}`);

  return { questions: SECURITY_QUESTIONS.length, admin: "actualizado" };
}
