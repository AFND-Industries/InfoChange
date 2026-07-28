import { z } from "zod";

const schema = z.object({
  /** Cadena de conexion Postgres. En produccion apunta a Neon. */
  DATABASE_URL: z.string().url(),
  /**
   * Clave para firmar los JWT de sesion. La version anterior llevaba el secreto
   * "IEEE754" escrito en el codigo y publicado en GitHub, con lo que cualquiera
   * podia falsificar una sesion.
   */
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET debe tener 32 caracteres o mas"),
  /** Origen del frontend. Solo hace falta cuando la API vive en otro dominio. */
  CORS_ORIGIN: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

/**
 * Se valida de forma perezosa: en una funcion serverless el modulo puede
 * cargarse en contextos (tests, generacion de migraciones) donde no estan
 * definidas todas las variables, y no queremos que reviente al importar.
 */
export function env(): Env {
  if (cached) return cached;

  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Configuracion invalida:\n${detail}`);
  }

  cached = parsed.data;
  return cached;
}

export function resetEnvCache(): void {
  cached = undefined;
}

export const isProduction = (): boolean => process.env.NODE_ENV === "production";
