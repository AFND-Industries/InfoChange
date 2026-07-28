import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

/**
 * Parametros de scrypt. N=2^15 con r=8 consume ~32 MB por hash, holgado dentro
 * del limite de memoria de una funcion de Vercel y suficientemente caro como
 * para que no compense atacar el hash por fuerza bruta.
 */
const PARAMS = { N: 32768, r: 8, p: 1, keyLength: 64 } as const;
const MAXMEM = 128 * PARAMS.N * PARAMS.r * 2;

/**
 * Se elige scrypt de `node:crypto` en vez de bcrypt o argon2 porque no arrastra
 * dependencias nativas, que en un despliegue serverless son una fuente constante
 * de problemas de compilacion.
 *
 * La version anterior guardaba SHA-256 sin sal ni coste, es decir, las
 * contrasenas de todos los usuarios eran recuperables con una tabla arcoiris.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password.normalize("NFKC"), salt, PARAMS.keyLength, {
    N: PARAMS.N,
    r: PARAMS.r,
    p: PARAMS.p,
    maxmem: MAXMEM,
  });

  return [
    "scrypt",
    PARAMS.N,
    PARAMS.r,
    PARAMS.p,
    salt.toString("base64"),
    derived.toString("base64"),
  ].join("$");
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [scheme, rawN, rawR, rawP, rawSalt, rawHash] = stored.split("$");
  if (scheme !== "scrypt" || !rawN || !rawR || !rawP || !rawSalt || !rawHash) {
    return false;
  }

  const N = Number(rawN);
  const r = Number(rawR);
  const p = Number(rawP);
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) {
    return false;
  }

  const salt = Buffer.from(rawSalt, "base64");
  const expected = Buffer.from(rawHash, "base64");
  if (expected.length === 0) return false;

  const derived = await scrypt(password.normalize("NFKC"), salt, expected.length, {
    N,
    r,
    p,
    maxmem: Math.max(MAXMEM, 128 * N * r * 2),
  });

  // La comparacion es en tiempo constante para no filtrar cuantos bytes coinciden.
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

/**
 * Compara siempre contra un hash real aunque el usuario no exista, de forma que
 * el tiempo de respuesta de `/auth/login` no revele que usuarios estan dados de
 * alta. El valor es un hash de una cadena aleatoria fijada al arrancar.
 */
let decoyHash: Promise<string> | undefined;

export async function burnPasswordComparison(password: string): Promise<void> {
  decoyHash ??= hashPassword(randomBytes(32).toString("hex"));
  await verifyPassword(password, await decoyHash);
}
