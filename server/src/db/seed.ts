import { neonConfig, Pool } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

import { env } from "../env";
import { hashPassword } from "../lib/password";
import { SECURITY_QUESTIONS } from "./seed-data";
import * as schema from "./schema";

neonConfig.webSocketConstructor = globalThis.WebSocket ?? ws;

/**
 * Deja la base de datos utilizable: preguntas de seguridad y, si se pasan las
 * variables correspondientes, una cuenta de administrador.
 *
 * Ser administrador es ahora una columna `role`. Antes bastaba con registrarse
 * poniendo "admin" como nombre de pila para leer la base de datos entera.
 *
 *   ADMIN_USERNAME=... ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run db:seed
 */
const pool = new Pool({ connectionString: env().DATABASE_URL });
const db = drizzle(pool, { schema });

try {
  await db
    .insert(schema.securityQuestions)
    .values(SECURITY_QUESTIONS.map((prompt) => ({ prompt })))
    .onConflictDoNothing();
  console.log(`Preguntas de seguridad: ${SECURITY_QUESTIONS.length}`);

  const username = process.env.ADMIN_USERNAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !email || !password) {
    console.log(
      "Sin cuenta de administrador: define ADMIN_USERNAME, ADMIN_EMAIL y ADMIN_PASSWORD para crearla.",
    );
  } else if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD debe tener al menos 12 caracteres.");
  } else {
    const [question] = await db.select().from(schema.securityQuestions).limit(1);

    const [admin] = await db
      .insert(schema.users)
      .values({
        username,
        email: email.toLowerCase(),
        passwordHash: await hashPassword(password),
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

    if (admin) {
      await db
        .insert(schema.wallets)
        .values({ userId: admin.id, asset: "USDT", quantity: "100000" })
        .onConflictDoNothing();
      console.log(`Administrador creado: ${admin.username}`);
    } else {
      // Ya existia: se asegura el rol sin tocar la contrasena.
      await db
        .update(schema.users)
        .set({ role: "admin" })
        .where(sql`lower(${schema.users.username}) = ${username.toLowerCase()}`);
      console.log(`Administrador ya existente, rol confirmado: ${username}`);
    }
  }
} finally {
  await pool.end();
}
