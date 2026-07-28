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
 * Si la cuenta ya existe se le concede el rol pero NO se le cambia la
 * contrasena, porque lo normal en ese caso es ascender a alguien que se
 * registro por la web. Para cambiarsela hay que pedirlo de forma explicita:
 *
 *   ADMIN_RESET_PASSWORD=1 npm run db:seed
 */
const username = process.env.ADMIN_USERNAME;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const resetPassword = /^(1|true|yes|si)$/i.test(process.env.ADMIN_RESET_PASSWORD ?? "");

const admin =
  username && email && password
    ? { username, email, password, resetPassword }
    : undefined;

await withCliDatabase(async (db) => {
  const result = await seedDatabase(db, admin);

  console.log(`Preguntas de seguridad: ${result.questions}`);
  console.log(
    {
      creado: `Administrador creado: ${username}`,
      "contrasena-actualizada": `Administrador ${username}: rol confirmado y contrasena actualizada.`,
      "rol-concedido":
        `Administrador ${username}: la cuenta ya existia, se le ha concedido el rol.\n` +
        "   Conserva su contrasena anterior. Para cambiarla:  ADMIN_RESET_PASSWORD=1 npm run db:seed",
      omitido:
        "Sin cuenta de administrador: define ADMIN_USERNAME, ADMIN_EMAIL y ADMIN_PASSWORD para crearla.",
    }[result.admin],
  );
});
