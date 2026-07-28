import { describe, expect, it } from "vitest";

import { money, parseAmount, toStorage } from "../src/lib/money.js";
import { hashPassword, verifyPassword } from "../src/lib/password.js";
import {
  createSessionToken,
  readSessionToken,
} from "../src/lib/session.js";
import { maskPaymentMethod } from "../src/schemas.js";

describe("contrasenas", () => {
  it("genera un hash distinto para la misma contrasena", async () => {
    const [first, second] = await Promise.all([
      hashPassword("contrasena123"),
      hashPassword("contrasena123"),
    ]);

    // Al llevar sal aleatoria, dos hashes de la misma contrasena no coinciden.
    // El SHA-256 sin sal de la version anterior producia siempre el mismo valor,
    // lo que permitia atacarlos en bloque con una tabla precalculada.
    expect(first).not.toBe(second);
    expect(first.startsWith("scrypt$32768$8$1$")).toBe(true);
  });

  it("verifica correctamente", async () => {
    const stored = await hashPassword("contrasena123");

    expect(await verifyPassword("contrasena123", stored)).toBe(true);
    expect(await verifyPassword("contrasena124", stored)).toBe(false);
    expect(await verifyPassword("", stored)).toBe(false);
  });

  it("no acepta un hash con formato corrupto", async () => {
    for (const stored of [
      "",
      "sha256$abc",
      "scrypt$abc",
      "scrypt$32768$8$1$$",
      "scrypt$x$y$z$c2FsdA==$aGFzaA==",
    ]) {
      expect(await verifyPassword("contrasena123", stored)).toBe(false);
    }
  });
});

describe("sesion", () => {
  it("firma y vuelve a leer las reclamaciones", async () => {
    const token = await createSessionToken({ userId: 42, role: "admin" });
    expect(await readSessionToken(token)).toEqual({ userId: 42, role: "admin" });
  });

  it("descarta un token manipulado", async () => {
    const token = await createSessionToken({ userId: 42, role: "user" });
    const [header, , signature] = token.split(".");

    // Cambiar el rol dentro del payload invalida la firma.
    const tampered = `${header}.${Buffer.from(
      JSON.stringify({ role: "admin", sub: "42", iss: "infochange" }),
    ).toString("base64url")}.${signature}`;

    expect(await readSessionToken(tampered)).toBeNull();
    expect(await readSessionToken("cualquier.cosa.rara")).toBeNull();
    expect(await readSessionToken("")).toBeNull();
  });
});

describe("importes", () => {
  it("acepta solo cantidades positivas y finitas", () => {
    expect(parseAmount("10.5")?.toFixed()).toBe("10.5");
    expect(parseAmount(3)?.toFixed()).toBe("3");

    for (const invalid of ["-1", "0", "abc", "", "NaN", "Infinity", null, {}]) {
      expect(parseAmount(invalid)).toBeNull();
    }
  });

  it("no acumula error al sumar en decimal", () => {
    // 0,1 + 0,2 con numeros en coma flotante da 0,30000000000000004.
    expect(money("0.1").plus("0.2").toFixed()).toBe("0.3");
    expect(0.1 + 0.2).not.toBe(0.3);
  });

  it("trunca hacia abajo al persistir, nunca redondea al alza", () => {
    // Redondear al alza en un saldo equivale a crear dinero de la nada, asi que
    // se corta en los 18 decimales que admite la columna. Se compara la cadena
    // que se guarda de verdad: convertirla a `Number` volveria a meter el error
    // de coma flotante que precisamente se quiere evitar (daria 2 exacto).
    expect(toStorage(money("1.9999999999999999999999"))).toBe(
      "1.999999999999999999",
    );
    expect(toStorage(money("0.000000000000000000999"))).toBe("0");
    expect(toStorage(money("1234.5"))).toBe("1234.5");
  });
});

describe("enmascarado de medios de pago", () => {
  it("conserva solo lo justo para reconocer el medio", () => {
    expect(
      maskPaymentMethod({
        type: "CARD",
        holder: "Ada",
        number: "4111111111111111",
        expiry: "12/30",
        cvv: "123",
      }),
    ).toBe("**** **** **** 1111");

    expect(
      maskPaymentMethod({
        type: "IBAN",
        holder: "Ada",
        iban: "ES9121000418450200051332",
      }),
    ).toBe("ES91 **** 1332");

    expect(maskPaymentMethod({ type: "PAYPAL", email: "ada@example.com" })).toBe(
      "ad***@example.com",
    );
  });
});
