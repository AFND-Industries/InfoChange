import { resolve } from "node:path";

import { config } from "dotenv";

/**
 * Carga el fichero `.env` para los procesos locales: servidor de desarrollo,
 * migraciones y datos iniciales.
 *
 * En Vercel no interviene, porque la plataforma inyecta las variables
 * directamente en el entorno. Se importa solo desde los scripts de desarrollo,
 * nunca desde la aplicacion, para que no acabe en el paquete de la funcion.
 *
 * El `.env` vive en la raiz del repositorio, pero los scripts de npm se ejecutan
 * dentro de `server/`, asi que la ruta se resuelve desde la ubicacion de este
 * modulo y no desde el directorio de trabajo. Tambien se admite un `.env` local
 * dentro de `server/` para quien prefiera separarlo.
 */
const repositoryRoot = resolve(import.meta.dirname, "../..");

config({ path: resolve(repositoryRoot, ".env"), quiet: true });
config({ path: resolve(repositoryRoot, "server/.env"), override: true, quiet: true });
