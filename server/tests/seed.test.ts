import { eq } from "drizzle-orm";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import type { Database } from "../src/db/client.js";
import { securityQuestions, users, wallets } from "../src/db/schema.js";
import { seedDatabase } from "../src/db/seed-core.js";
import { SECURITY_QUESTIONS } from "../src/db/seed-data.js";
import { createTestDatabase, registrationFor, resetTestState, TestClient } from "./helpers.js";

let db: Database;
let close: () => Promise<void>;

beforeAll(async () => {
  ({ db, close } = await createTestDatabase());
});

afterAll(async () => {
  await close();
});

afterEach(() => {
  resetTestState();
});

const ADMIN = {
  username: "jefatura",
  email: "Jefatura@Example.com",
  password: "contrasena-larga-123",
};

describe("datos iniciales", () => {
  it("no duplica las preguntas de seguridad al repetirse", async () => {
    // `createTestDatabase` ya las inserta una vez; el seeding debe ser
    // idempotente porque se ejecuta en cada despliegue.
    await seedDatabase(db);
    await seedDatabase(db);

    const rows = await db.select().from(securityQuestions);
    expect(rows).toHaveLength(SECURITY_QUESTIONS.length);
  });

  it("crea el administrador con rol, saldo y contrasena verificable", async () => {
    const result = await seedDatabase(db, ADMIN);
    expect(result.admin).toBe("creado");

    const [admin] = await db
      .select()
      .from(users)
      .where(eq(users.username, ADMIN.username));

    expect(admin?.role).toBe("admin");
    expect(admin?.email).toBe("jefatura@example.com");

    const balances = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, admin!.id));
    expect(Number(balances[0]?.quantity)).toBe(100_000);

    // La prueba que importa: que la cuenta creada sirve para entrar y para
    // abrir el panel de administracion.
    const client = new TestClient();
    const login = await client.post("/api/auth/login", {
      username: ADMIN.username,
      password: ADMIN.password,
    });
    expect(login.status).toBe(200);
    expect(login.body.user.role).toBe("admin");

    expect((await client.get("/api/admin/overview")).status).toBe(200);
  });

  it("concede el rol a una cuenta ya registrada sin cambiarle la contrasena", async () => {
    const client = new TestClient();
    await client.post("/api/auth/register", registrationFor("aspirante"));
    client.clearCookie();

    expect((await client.get("/api/admin/overview")).status).toBe(401);

    const result = await seedDatabase(db, {
      username: "aspirante",
      email: "aspirante@example.com",
      password: "otra-contrasena-larga",
    });
    expect(result.admin).toBe("rol-concedido");

    // Entra con su contrasena original, no con la que se paso al seeding.
    const login = await client.post("/api/auth/login", {
      username: "aspirante",
      password: registrationFor("aspirante").password,
    });
    expect(login.status).toBe(200);
    expect(login.body.user.role).toBe("admin");
    expect((await client.get("/api/admin/overview")).status).toBe(200);
  });

  it("cambia la contrasena de una cuenta existente solo si se pide", async () => {
    const client = new TestClient();
    await client.post("/api/auth/register", registrationFor("olvidadiza"));
    client.clearCookie();

    const nueva = "contrasena-nueva-2026";
    const result = await seedDatabase(db, {
      username: "olvidadiza",
      email: "olvidadiza@example.com",
      password: nueva,
      resetPassword: true,
    });
    expect(result.admin).toBe("contrasena-actualizada");

    // La nueva sirve y la antigua ya no.
    expect(
      (await client.post("/api/auth/login", { username: "olvidadiza", password: nueva }))
        .status,
    ).toBe(200);

    client.clearCookie();
    expect(
      (
        await client.post("/api/auth/login", {
          username: "olvidadiza",
          password: registrationFor("olvidadiza").password,
        })
      ).status,
    ).toBe(401);
  });

  it("rechaza una contrasena de administrador demasiado corta", async () => {
    await expect(
      seedDatabase(db, { ...ADMIN, username: "corta", password: "1234" }),
    ).rejects.toThrow(/al menos 12/);
  });
});
