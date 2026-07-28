import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

/**
 * Parametros de scrypt. N=2^15 con r=8 consume ~32 MB por hash, holgado dentro
 * del limite de memoria de una funcion de Vercel y suficientemente caro como
 * para que no compense atacar el hash por fuerza bruta.
 */
interface ScryptParams {
  N: number;
  r: number;
  p: number;
  keyLength: number;
}

const PARAMS: ScryptParams = { N: 32768, r: 8, p: 1, keyLength: 64 };
const MAXMEM = 128 * PARAMS.N * PARAMS.r * 2;

/**
 * Se usa la variante asincrona: delega el calculo en el threadpool y deja el
 * hilo principal libre para atender otras peticiones, que es lo que interesa en
 * una funcion que sirve varias a la vez.
 *
 * (Durante la puesta en produccion se llego a sospechar que la plataforma
 * estrangulaba ese threadpool, porque los login agotaban la invocacion. Medido,
 * resulto que no: sincrono y asincrono tardan lo mismo. La causa era el
 * adaptador de peticiones, no el hash.)
 */
function derive(
  password: string,
  salt: Buffer,
  keyLength: number,
  params: ScryptParams = PARAMS,
): Promise<Buffer> {
  return new Promise((resolver, rechazar) => {
    scrypt(
      password.normalize("NFKC"),
      salt,
      keyLength,
      {
        N: params.N,
        r: params.r,
        p: params.p,
        maxmem: Math.max(MAXMEM, 128 * params.N * params.r * 2),
      },
      (error, derivada) => (error ? rechazar(error) : resolver(derivada)),
    );
  });
}

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
  const derived = await derive(password, salt, PARAMS.keyLength);

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

  const derived = await derive(password, salt, expected.length, {
    N,
    r,
    p,
    keyLength: expected.length,
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
