import { withCliDatabase } from "./connect-cli";
import { seedDatabase } from "./seed-core";

/**
 * Deja la base de datos utilizable: preguntas de seguridad y, si se pasan las
 * variables correspondientes, una cuenta de administrador.
 *
 * Ser administrador es ahora una columna `role`. Antes bastaba con registrarse
 * poniendo "admin" como nombre de pila para leer la base de datos entera.
 *
 *   ADMIN_USERNAME=... ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run db:seed
 *
 * Si la cuenta ya existe, se limita a concederle el rol: sirve para promover a
 * administrador a alguien que se registro desde la web, sin tocar su contrasena.
 */
const username = process.env.ADMIN_USERNAME;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

const admin =
  username && email && password ? { username, email, password } : undefined;

await withCliDatabase(async (db) => {
  const result = await seedDatabase(db, admin);

  console.log(`Preguntas de seguridad: ${result.questions}`);
  console.log(
    {
      creado: `Administrador creado: ${username}`,
      actualizado: `Administrador ya existente, rol concedido: ${username}`,
      omitido:
        "Sin cuenta de administrador: define ADMIN_USERNAME, ADMIN_EMAIL y ADMIN_PASSWORD para crearla.",
    }[result.admin],
  );
});
