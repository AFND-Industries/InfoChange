import { serve } from "@hono/node-server";

// Antes de importar la aplicacion: al arrancar lee la configuracion.
import "./load-env";
import app from "./app";
import { setDatabase } from "./db/client";

/**
 * Servidor local. En produccion no se usa: Vercel invoca la misma aplicacion a
 * traves de `api/[...route].ts`. Vite hace de proxy de `/api` hacia este puerto,
 * de modo que en desarrollo tambien se trabaja sobre un unico origen y las
 * cookies de sesion se comportan igual que en el despliegue.
 *
 * Sin `DATABASE_URL` arranca sobre PGlite, un Postgres real compilado a
 * WebAssembly que corre dentro del propio proceso. Asi se puede clonar el
 * repositorio y tener la aplicacion funcionando sin dar de alta ninguna base de
 * datos; los datos se pierden al parar el servidor.
 */
const port = Number(process.env.PORT ?? 3003);

/** Credenciales del administrador de desarrollo, para poder abrir /admin en local. */
const DEV_ADMIN = {
  username: "admin",
  email: "admin@localhost",
  password: "administrador-local",
};

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgres://local/infochange";
  process.env.SESSION_SECRET ??= "secreto-solo-para-desarrollo-local-0000000000";

  // Import diferido: PGlite es una dependencia de desarrollo y no debe formar
  // parte del despliegue.
  const [{ PGlite }, { drizzle }, { migrate }, schema, { seedDatabase }] =
    await Promise.all([
      import("@electric-sql/pglite"),
      import("drizzle-orm/pglite"),
      import("drizzle-orm/pglite/migrator"),
      import("./db/schema"),
      import("./db/seed-core"),
    ]);

  const db = drizzle(new PGlite(), { schema });
  await migrate(db, { migrationsFolder: "./drizzle" });

  // Se reutiliza el mismo seeding que en produccion, incluida la cuenta de
  // administrador: sin ella no habria forma de abrir /admin en local, porque el
  // rol solo se concede desde la base de datos.
  setDatabase(db);
  await seedDatabase(db, DEV_ADMIN);

  console.log("Sin DATABASE_URL: usando PGlite en memoria (los datos no persisten).");
  console.log(
    `Administrador de desarrollo: ${DEV_ADMIN.username} / ${DEV_ADMIN.password}`,
  );
}

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`InfoChange API escuchando en http://localhost:${info.port}/api`);
});
