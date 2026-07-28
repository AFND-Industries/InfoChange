# Auditoría de InfoChange v1 y qué se ha hecho con cada hallazgo

Revisión completa del proyecto tal y como estaba en la rama `main` (último commit
real, junio de 2025) y registro de cómo se ha resuelto cada punto en la v2.

InfoChange es un simulador: el dinero es ficticio y no hay pasarela de pago real.
Aun así, varios de los fallos de abajo son explotables de verdad (fuga de datos
personales, ejecución de HTML en el navegador de otro usuario, credenciales
publicadas), y el resto son exactamente los errores que sí importarían en un
sistema real.

## Resumen

| Severidad | Hallazgos | Resueltos |
| --- | --- | --- |
| Crítica | 6 | 6 |
| Alta | 11 | 11 |
| Media | 14 | 14 |
| Baja / calidad | 18 | 18 |

---

## Crítico

### C1. Inyección SQL en todo el backend antiguo

`old_server/src/index.js` construía **todas** sus consultas concatenando
cadenas. El login era el caso de libro:

```js
const query = "SELECT * FROM usuario WHERE username LIKE '" + req.body.user +
  "' AND password LIKE '" + hash(req.body.pass) + "'";
```

Con `user = "' OR '1'='1' -- "` se entraba como el primer usuario de la tabla.
No había una sola consulta parametrizada en 934 líneas.

**Resuelto:** `old_server/` se ha eliminado. El backend nuevo usa Drizzle ORM,
que parametriza siempre. Además `start.bat` arrancaba precisamente ese servidor,
de modo que la forma documentada de levantar el proyecto era la vulnerable.

### C2. Volcado de usuarios sin autenticar

`GET /users` devolvía `SELECT * FROM usuario` entero —incluidos los hashes de
contraseña— a cualquiera que lo pidiese.

**Resuelto:** la ruta no existe. Los datos de otros usuarios solo se exponen a
través de `/api/wallet/recipients`, que exige sesión y devuelve cuatro campos.

### C3. Contraseñas con SHA-256 sin sal

```js
const hash = (string) => createHash("sha256").update(string).digest("hex");
```

Sin sal y sin factor de coste: una tabla arcoíris recupera las contraseñas de
todos los usuarios de golpe.

**Resuelto:** `scrypt` de `node:crypto` con sal aleatoria de 16 bytes y N=32768
(~32 MB por hash). Se eligió frente a bcrypt o argon2 porque no arrastra
dependencias nativas, que en serverless dan problemas de compilación. El formato
guardado es `scrypt$N$r$p$sal$hash`, así que los parámetros se pueden subir en el
futuro sin invalidar los hashes existentes.

### C4. Ser administrador era llamarse «admin»

```js
if (!req.session.user || req.session.user.firstName !== "admin") {
```

No existía columna de rol. Cualquiera que se registrase poniendo `admin` en el
campo *nombre* obtenía el volcado completo de la base de datos: todos los
usuarios, carteras, pagos y transferencias. El frontend hacía la misma
comprobación, y también sobre el nombre de pila.

**Resuelto:** columna `role` con restricción `check` (`'user' | 'admin'`), que
solo se concede desde el script de seeding o directamente en la base de datos.
El registro ignora cualquier `role` que llegue en el cuerpo de la petición. Hay
tests que lo comprueban, incluido el caso de registrarse con el nombre `admin`.

### C5. Datos de pago reales almacenados en claro

El formulario pedía número de tarjeta, caducidad, **CVV**, IBAN y hasta la
**contraseña de PayPal**, y el servidor los guardaba tal cual:

```js
info: req.body.method.info
```

**Resuelto:** el medio de pago se valida como unión discriminada y se guarda
únicamente una referencia enmascarada (`**** **** **** 1111`). El CVV y la
contraseña de PayPal ya no se piden ni se almacenan. Hay un test que verifica
que el número completo no aparece en la respuesta ni en la base de datos.

### C6. Credenciales de base de datos publicadas

`old_server/.env`, versionado y presente además en la rama `prod-backend`:

```
USER=taw_grupo8
PASSWORD=taw_grupo8
```

**Resuelto:** el fichero ya no existe. `.gitignore` excluye todo `.env` salvo
`.env.example`, y la CI falla si alguno vuelve a colarse. La credencial en sí
pertenece a un backend retirado y a un servidor de laboratorio, pero **sigue
estando en el historial de git**: ver «Pendiente» al final.

---

## Alto

### A1. Secreto de sesión escrito en el código

`app.use(session({ secret: "IEEE754" }))`, publicado en GitHub: cualquiera podía
firmar una cookie de sesión válida.

**Resuelto:** JWT firmado con `SESSION_SECRET`, que se valida al arrancar y debe
tener 32 caracteres o más. Sin esa variable la aplicación no levanta.

### A2. Doble gasto por falta de transacciones

`/bizum`, `/trade` y `/payment` leían el saldo, comprobaban en JavaScript y
escribían después, con varios `await` intercalados y sin transacción. Dos
peticiones simultáneas pasaban ambas la comprobación.

**Resuelto:** la comprobación viaja dentro del `UPDATE`:

```sql
UPDATE wallets SET quantity = quantity - $1
WHERE user_id = $2 AND asset = $3 AND quantity >= $1
```

Si no actualiza ninguna fila, no había saldo. Todo el movimiento va en una
transacción y la columna tiene `CHECK (quantity >= 0)` como última red. Un test
lanza diez transferencias simultáneas de 2.000 sobre un saldo de 10.000 y
comprueba que como mucho cuadran cinco.

### A3. Retirar en negativo aumentaba el saldo

```js
if (!wallet || wallet.quantity < cart.quantity) { ... }
const newQuantity = parseFloat(wallet.quantity) - parseFloat(cart.quantity);
```

Con `cart.quantity = -100`, la comprobación `10000 < -100` era falsa, así que se
ejecutaba `10000 - (-100) = 10100`. Dinero gratis, y encima con su registro de
retirada.

**Resuelto:** validación con zod (número positivo, tope de mil millones) más la
restricción `CHECK` en la base de datos. Con test propio.

### A4. Ingresar dinero no validaba nada

`/payment` acreditaba `cart.quantity` sin comprobar que fuese un número ni que
fuese positivo, y `cart.type` era un nombre de activo arbitrario que venía del
cliente: se podía uno acreditar 10^300 unidades de un activo inventado.

**Resuelto:** el importe se valida y los ingresos se liquidan siempre en USDT.

### A5. El hash de la contraseña se enviaba al navegador

`GET /auth` devolvía la fila entera del usuario, hash incluido, y el frontend la
pedía **cada cinco segundos**.

**Resuelto:** `toPublicUser()` es la única forma de serializar un usuario y
enumera los campos permitidos, de modo que añadir una columna sensible al esquema
no la expone por descuido. Un test comprueba que no aparece `scrypt` en la
respuesta.

### A6. Inyección de HTML a través del nombre de usuario

```js
toastBody.innerHTML = "<span>Has <b>recibido</b> un bizum de <b>" +
  lastBizum.quantity + "$</b> de <b>" + lastBizum.sender + "</b></span>";
```

Registrarse con un nombre que contuviera HTML ejecutaba código en el navegador de
quien recibía el dinero. Mismo patrón en los avisos de login, registro y bizum, y
el mensaje del servidor (`response.data.cause`) se inyectaba igual.

**Resuelto:** no queda ningún `innerHTML`. Los avisos pasan por
`ToastProvider`, que renderiza con React y escapa siempre. El nombre de usuario
además está restringido a `[a-zA-Z0-9_-]`.

### A7. `/bizum_users` exponía datos personales sin sesión

Nombre, apellidos, usuario e id de diez usuarios a cualquier visitante anónimo.

**Resuelto:** `/api/wallet/recipients` exige sesión, excluye al propio usuario y
acepta búsqueda por nombre. Antes no filtraba: devolvía siempre las mismas diez
filas, así que la función de enviar dinero estaba a medio hacer.

### A8. Transferir a un usuario inexistente hacía desaparecer el dinero

No se comprobaba que el destinatario existiese; se creaba una cartera para
cualquier id numérico.

**Resuelto:** se verifica dentro de la transacción y hay clave foránea. Test
incluido.

### A9. Los errores devolvían la excepción al cliente

```js
utils.error("ERROR", `Ha ocurrido un error inesperado: ${e}`)
```

En los siete controladores. Filtraba consultas SQL, nombres de tabla y rutas del
servidor. El backend antiguo devolvía además `err.sqlMessage` directamente.

**Resuelto:** un único `onError`. Solo salen al exterior los errores declarados
como `ApiError`; el resto se registra en el servidor y el cliente recibe un
mensaje genérico.

### A10. Sin límite de intentos

Nada impedía probar contraseñas en bucle contra `/login`, y menos aún contra un
SHA-256 sin sal.

**Resuelto:** limitador por ventana en `/auth/login` (10 cada 15 min), registro,
comprobación de correo y operaciones. En serverless el contador vive en cada
instancia, así que el límite es aproximado; corta el abuso desde un mismo origen,
que es el caso que importa aquí.

### A11. `/logout` era un GET

Bastaba con incrustar `<img src="https://.../logout">` en cualquier página para
cerrar la sesión de quien la visitara.

**Resuelto:** `POST /api/auth/logout`. Todas las rutas que cambian estado son
POST y la cookie es `SameSite=Lax`, lo que cubre el CSRF sin necesidad de tokens.

---

## Medio

| # | Hallazgo | Resolución |
| --- | --- | --- |
| M1 | `/checkemail` comparaba el objeto de `findAndCountAll` con `> 0`: **siempre** respondía «disponible» | Consulta correcta más índices únicos sobre `lower(email)` y `lower(username)` |
| M2 | Login con `Op.like`: el usuario `%` entraba como cualquiera | Comparación por igualdad sobre el índice único; test específico |
| M3 | Sesiones en `MemoryStore`, sin `secure`, `sameSite` ni `maxAge` | JWT en cookie `httpOnly`, `Secure` en producción, `SameSite=Lax`, 7 días |
| M4 | Sin `session.regenerate()` al entrar: fijación de sesión | El token se emite nuevo en cada acceso |
| M5 | Sin validación de entrada en ningún sitio | zod en todas las rutas; mayoría de edad, fuerza de contraseña, formato de IBAN y de tarjeta |
| M6 | `crypto` de npm en las dependencias, tapando el módulo nativo | Eliminada |
| M7 | Saldos como `REAL` y con `toFixed(8)`; en un punto se guardaban como cadena | `numeric(38,18)` y aritmética con decimal.js |
| M8 | Fechas como texto construido a mano en cinco sitios | `timestamptz` con `defaultNow()` |
| M9 | Sin esquema ni migraciones: la base de datos de producción se creaba a mano | Migraciones generadas por Drizzle y versionadas; los tests corren sobre ellas |
| M10 | Símbolo desconocido en `/trade`: `symbol.length` fuera del `try` → 500 sin controlar | 404 con código `UNKNOWN_SYMBOL`; test incluido |
| M11 | `historyController` llamaba a `error(...)`, identificador inexistente → `ReferenceError` | Reescrito |
| M12 | Sin cabeceras de seguridad | `secureHeaders()` de Hono |
| M13 | CORS abierto a `*` si faltaba `SERVER_URL`, con `credentials: true` | Mismo origen; si se define `CORS_ORIGIN`, lista blanca explícita |
| M14 | La respuesta secreta se guardaba en claro | Hasheada como la contraseña |

---

## Rendimiento

### P1. 6,7 MB de JSON empaquetados en el bundle

`CoinMarketCapData.json` (4,26 MB), `Data.json` (1,71 MB) y `Symbols.json`
(708 kB) se importaban de forma estática y acababan dentro del JavaScript: el
bundle pesaba ~3,7 MB y se parseaba entero en cada carga. `Data.json` era además
una foto congelada de Binance y `Symbols.json` llevaba el sello de marzo de 2024.

**Resuelto:**

| Fichero | Antes | Ahora |
| --- | --- | --- |
| `CoinMarketCapData.json` | 4,26 MB en el bundle | 62 kB servidos por la API (10 kB comprimidos) + 540 kB de descripciones en carga diferida, solo en la ficha de una moneda |
| `Symbols.json` | 708 kB congelados | `/api/market/symbols`, en vivo desde Binance y cacheado 1 h en la CDN |
| `Data.json` | 1,71 MB congelados | `/api/market/coins`, en vivo |

Además, cada pantalla se carga bajo demanda con `React.lazy`.

### P2. Entre dos y tres peticiones por segundo y usuario

Cuatro `setInterval` permanentes: sesión y cartera cada 5 s (dos peticiones),
precios cada 10 s, panel de administración cada 10 s y monedas cada 120 s. Seguían
corriendo con la pestaña en segundo plano y en la página pública.

**Resuelto:** React Query, que refresca al volver a la pestaña e invalida lo
afectado después de cada operación. Solo los precios mantienen un refresco
periódico (15 s, y únicamente con la pestaña visible). Sesión y cartera van ahora
en una sola respuesta, que es justo lo que pedía un comentario del código
original.

### P3. Binance consultado desde `setInterval` al importar el módulo

Dos temporizadores arrancaban al cargar el módulo. En serverless eso no llega a
ejecutarse o se reinicia en cada arranque en frío. `/trade` dependía de esa caché
y devolvía `NO_SERVER_PRICE` cuando estaba vacía.

**Resuelto:** peticiones bajo demanda con caché de módulo y, sobre todo,
`Cache-Control` con `s-maxage`, de modo que la CDN de Vercel absorbe el tráfico y
Binance recibe como mucho una petición por ventana. Si Binance falla, se sirve el
último valor conocido en lugar de dejar la aplicación sin precios.

### P4. Cuatro librerías de interfaz a la vez

Bootstrap, MUI + Emotion, PrimeReact y MDB. MUI se usaba **solo** para el stepper
del registro; MDB solo aparecía en un fichero muerto llamado `Footer copy.jsx`.

**Resuelto:** eliminadas MUI, Emotion, MDB, bs-stepper, axios, html2canvas y
react-scroll-parallax. El stepper es ahora un componente propio con clases de
Bootstrap. Bootstrap además se cargaba tres veces (CDN, copia local de 232 kB y
paquete de npm); queda solo el de npm.

---

## Calidad y mantenimiento

- **Código muerto:** `Footer copy.jsx`, `Stepper copy.jsx`, `DBController.js`
  (llamaba a funciones inexistentes y no lo importaba nadie), `options.json`,
  las vistas `.jade` del generador de Express, `users.json` con contraseñas en
  claro, tres `.js` sin referenciar en `public/` y una copia entera de
  `bootstrap.css`. Todo eliminado.
- **`start.bat` arrancaba el servidor equivocado** (`old_server`, el vulnerable,
  que además reventaba al no haber MySQL). Sustituido por `npm run dev`.
- **Tres dominios distintos** conviviendo en el repositorio
  (`infochange.afndindustries.es`, `icb.afndindustries.es`, `infochange.me`).
  Ahora la API es siempre `/api`, del mismo origen.
- **Sin tests.** Ahora hay 52, incluidos los de concurrencia, corriendo sobre un
  Postgres real (PGlite) con las migraciones de verdad.
- **Sin CI.** Los dos flujos existentes solo desplegaban, y el de backend estaba
  roto desde junio de 2024 por un salto de línea perdido que dejaba
  `cd prod-backend` como argumento del `git clone`. Ahora hay CI de tipos,
  estilo, tests y build.
- **TypeScript decorativo:** tres ficheros `.ts` sin `tsconfig.json`, con tipos
  que no coincidían con los datos reales (`name`/`surname`/`postalCode` frente a
  `firstName`/`lastName`/`city`). Ahora los contratos viven en `lib/endpoints.ts`
  y se comprueban de verdad.
- **Licencia contradictoria:** el `README` decía CC BY-NC-SA y `Licence.md`
  contenía el texto de CC BY-NC-ND. Reconciliado.
- **Rama `develop` abandonada:** siete commits por detrás de `main` y sin
  contenido propio (`git diff main...develop` está vacío).

---

## Pendiente, requiere intervención manual

1. **Purgar el historial de git.** `old_server/.env` con `taw_grupo8/taw_grupo8`
   sigue en los commits antiguos y en la rama `prod-backend`. Reescribir el
   historial (`git filter-repo`) obliga a que todos los colaboradores vuelvan a
   clonar, así que es una decisión del dueño del repositorio. La credencial es de
   un servidor de laboratorio ya retirado, pero conviene rotarla igualmente si
   ese usuario de MySQL sigue existiendo.
2. **Ramas de despliegue.** `prod-frontend` acumula 408 commits y ~104 MB de
   bundles compilados (cada despliegue añadía ~3,7 MB que no comprimen contra el
   anterior). Ya no se usan: se pueden borrar `prod-frontend`, `prod-backend` y
   `develop`.
3. **Tipografía Futura.** `docs/design/fonts/FUTURA65MEDIUM.TTF` es una fuente
   comercial en un repositorio público. Conviene sustituirla o retirarla.
4. **Secretos de GitHub Actions.** `ANT_GITHUB_TOKEN`, `HOST`, `USERNAME`, `KEY`,
   `PORT` y `PASSWORD` ya no los usa ningún flujo; se pueden eliminar y rotar.
   El flujo antiguo pasaba la contraseña de sudo con `echo ... | sudo -S`, que la
   deja visible en la lista de procesos del servidor.
