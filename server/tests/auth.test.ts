import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import app from "../src/app.js";
import {
  createTestDatabase,
  registrationFor,
  resetTestState,
  TestClient,
  VALID_REGISTRATION,
} from "./helpers.js";

let close: () => Promise<void>;

beforeAll(async () => {
  ({ close } = await createTestDatabase());
});

afterAll(async () => {
  await close();
});

afterEach(() => {
  resetTestState();
});

describe("registro", () => {
  it("crea la cuenta, abre sesion y entrega el saldo de bienvenida", async () => {
    const client = new TestClient();
    const response = await client.post("/api/auth/register", registrationFor("nuevo"));

    expect(response.status).toBe(201);
    expect(response.body.user.username).toBe("nuevo");
    expect(response.body.user.role).toBe("user");
    expect(response.body.balances).toEqual([
      { asset: "USDT", quantity: "10000" },
    ]);
    expect(response.headers.get("set-cookie")).toContain("infochange_session=");
  });

  it("nunca devuelve el hash de la contrasena", async () => {
    const client = new TestClient();
    const response = await client.post("/api/auth/register", registrationFor("sinhash"));

    // La version anterior serializaba la fila entera del usuario en cada /auth.
    expect(JSON.stringify(response.body)).not.toContain("scrypt");
    expect(response.body.user).not.toHaveProperty("passwordHash");
    expect(response.body.user).not.toHaveProperty("securityAnswerHash");
    expect(response.body.user).not.toHaveProperty("documentId");
  });

  it("rechaza un usuario duplicado sin distinguir mayusculas", async () => {
    const client = new TestClient();
    await client.post("/api/auth/register", registrationFor("duplicado"));

    const second = await client.post("/api/auth/register", {
      ...registrationFor("duplicado"),
      username: "DUPLICADO",
      email: "otro@example.com",
    });

    expect(second.status).toBe(409);
    expect(second.body.error.code).toBe("ACCOUNT_EXISTS");
  });

  it("rechaza contrasenas debiles y menores de edad", async () => {
    const client = new TestClient();

    const weak = await client.post("/api/auth/register", {
      ...registrationFor("debil"),
      password: "1234",
    });
    expect(weak.status).toBe(400);
    expect(weak.body.error.code).toBe("VALIDATION_ERROR");

    const minor = await client.post("/api/auth/register", {
      ...registrationFor("menor"),
      birthDate: "2020-01-01",
    });
    expect(minor.status).toBe(400);
  });

  it("no permite elegir el rol de administrador desde el formulario", async () => {
    const client = new TestClient();
    const response = await client.post("/api/auth/register", {
      ...registrationFor("intruso"),
      role: "admin",
    });

    expect(response.status).toBe(201);
    expect(response.body.user.role).toBe("user");
  });
});

describe("acceso", () => {
  it("acepta usuario o correo y mantiene la sesion", async () => {
    const client = new TestClient();
    await client.post("/api/auth/register", registrationFor("acceso"));
    client.clearCookie();

    const byUsername = await client.post("/api/auth/login", {
      username: "acceso",
      password: VALID_REGISTRATION.password,
    });
    expect(byUsername.status).toBe(200);

    const me = await client.get("/api/auth/me");
    expect(me.status).toBe(200);
    expect(me.body.user.username).toBe("acceso");

    client.clearCookie();
    const byEmail = await client.post("/api/auth/login", {
      username: "acceso@example.com",
      password: VALID_REGISTRATION.password,
    });
    expect(byEmail.status).toBe(200);
  });

  it("no deja entrar con comodines de LIKE en el usuario", async () => {
    const client = new TestClient();
    await client.post("/api/auth/register", registrationFor("victima"));
    client.clearCookie();

    // Con la comparacion `Op.like` anterior, "%" casaba con cualquier usuario.
    for (const username of ["%", "_ictima", "victim%"]) {
      const response = await client.post("/api/auth/login", {
        username,
        password: VALID_REGISTRATION.password,
      });
      expect(response.status).toBe(401);
    }
  });

  it("rechaza la contrasena incorrecta con el mismo mensaje que un usuario inexistente", async () => {
    const client = new TestClient();
    await client.post("/api/auth/register", registrationFor("mensajes"));
    client.clearCookie();

    const wrongPassword = await client.post("/api/auth/login", {
      username: "mensajes",
      password: "otracosa456",
    });
    const unknownUser = await client.post("/api/auth/login", {
      username: "noexiste",
      password: "otracosa456",
    });

    expect(wrongPassword.status).toBe(401);
    expect(unknownUser.status).toBe(401);
    expect(wrongPassword.body.error.message).toBe(unknownUser.body.error.message);
  });

  it("cierra la sesion", async () => {
    const client = new TestClient();
    await client.post("/api/auth/register", registrationFor("salida"));

    expect((await client.get("/api/auth/me")).body.user.username).toBe("salida");

    await client.post("/api/auth/logout");
    client.clearCookie();

    // Sin sesion, /auth/me responde 200 con user null: no tener sesion no es un
    // error, es el estado normal de un visitante.
    const anonymous = await client.get("/api/auth/me");
    expect(anonymous.status).toBe(200);
    expect(anonymous.body.user).toBeNull();
    expect(anonymous.body.balances).toEqual([]);
  });

  it("no acepta un token con la firma manipulada", async () => {
    const client = new TestClient();
    const registration = await client.post(
      "/api/auth/register",
      registrationFor("firmado"),
    );

    const token = String(registration.body.token);
    const [header, payload] = token.split(".");

    // El token legitimo sirve tambien como Bearer, que es lo que usa la
    // aplicacion Android empaquetada con Capacitor.
    const valid = await app.request("http://localhost/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(((await valid.json()) as any).user.username).toBe("firmado");

    for (const forged of [
      `${header}.${payload}.firmainventada`,
      `${header}.${payload}.`,
      "no-es-un-token",
    ]) {
      // Una firma invalida no da acceso: se trata como si no hubiese sesion.
      const anonymous = await app.request("http://localhost/api/auth/me", {
        headers: { Authorization: `Bearer ${forged}` },
      });
      expect(((await anonymous.json()) as any).user).toBeNull();

      // Y en una ruta que si exige sesion, es un 401.
      const rejected = await app.request("http://localhost/api/wallet", {
        headers: { Authorization: `Bearer ${forged}` },
      });
      expect(rejected.status).toBe(401);
    }
  });

  it("limita los intentos de acceso repetidos", async () => {
    const client = new TestClient();
    const attempts = [];

    for (let i = 0; i < 12; i++) {
      attempts.push(
        await client.post("/api/auth/login", {
          username: "fuerzabruta",
          password: `intento-${i}`,
        }),
      );
    }

    expect(attempts.some((response) => response.status === 429)).toBe(true);
  });
});

describe("comprobacion de correo", () => {
  it("detecta los correos ya registrados", async () => {
    const client = new TestClient();
    await client.post("/api/auth/register", registrationFor("correo"));

    // El `findAndCountAll` anterior comparaba un objeto con `> 0`, asi que esta
    // ruta respondia siempre "disponible".
    const taken = await client.post("/api/auth/check-email", {
      email: "correo@example.com",
    });
    expect(taken.body.available).toBe(false);

    const free = await client.post("/api/auth/check-email", {
      email: "libre@example.com",
    });
    expect(free.body.available).toBe(true);
  });
});

describe("rutas protegidas", () => {
  it("responde 401 sin sesion", async () => {
    const client = new TestClient();

    for (const path of [
      "/api/wallet",
      "/api/wallet/recipients",
      "/api/history/trades",
      "/api/history/payments",
      "/api/history/transfers",
      "/api/admin/overview",
    ]) {
      expect((await client.get(path)).status).toBe(401);
    }
  });

  it("no deja entrar al panel de administracion a un usuario normal", async () => {
    const client = new TestClient();
    await client.post("/api/auth/register", registrationFor("curioso"));

    // Antes bastaba con registrarse poniendo "admin" como nombre de pila.
    const response = await client.get("/api/admin/overview");
    expect(response.status).toBe(403);
  });

  it("tampoco con el nombre de pila admin", async () => {
    const client = new TestClient();
    await client.post("/api/auth/register", {
      ...registrationFor("falsoadmin"),
      firstName: "admin",
    });

    expect((await client.get("/api/admin/overview")).status).toBe(403);
  });
});
