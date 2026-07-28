# Despliegue

Todo el proyecto —web, API y base de datos— vive en servicios con plan gratuito y
se despliega como **un único proyecto de Vercel**. No hay servidor que mantener.

| Pieza | Servicio | Plan gratuito |
| --- | --- | --- |
| Frontend (estático) | Vercel | 100 GB de tráfico al mes |
| API (`/api/*`) | Vercel Functions | 100 GB-hora de cómputo |
| Base de datos | Neon (Postgres) | 0,5 GB, 100 CU-hora al mes |

## Por qué Neon y no Supabase

Supabase **pausa** el proyecto tras una semana sin actividad y hay que
reactivarlo a mano desde el panel. En algo que enseñas en un portfolio eso
significa que puede estar caído justo cuando alguien lo abre. Neon suspende el
cómputo a los 5 minutos de inactividad, pero **se despierta solo** en unos cientos
de milisegundos con la primera consulta. Sin intervención manual nunca.

---

## Puesta en marcha

### 1. Base de datos

1. Crear una cuenta en [neon.com](https://neon.com) y un proyecto.
2. Copiar la cadena de conexión **con pooler** (`Connection string` →
   `Pooled connection`).

### 2. Local

```bash
git clone <repositorio>
cd InfoChange
npm install

cp .env.example .env
# Rellenar DATABASE_URL con la cadena de Neon.
# Generar el secreto de sesión:
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

Aplicar el esquema y los datos iniciales:

```bash
npm run db:migrate
npm run db:seed
```

Arrancar (API en el 3003, web en el 5173, con Vite haciendo de proxy de `/api`
para que en desarrollo también sea un único origen):

```bash
npm run dev
```

> Los pasos 1 y 2 se pueden saltar para una primera prueba: sin `DATABASE_URL`,
> `npm run dev` levanta un Postgres en memoria (PGlite) con el esquema aplicado.
> Los scripts `db:migrate` y `db:seed` usan el driver estándar de Postgres por
> TCP, así que funcionan igual contra Neon, contra un Postgres en Docker o
> contra el de cualquier otro proveedor.

### 3. Vercel

1. **Add New → Project** e importar el repositorio. La configuración la toma de
   `vercel.json`; no hay que tocar nada en la interfaz.
2. En **Settings → Environment Variables**, para *Production*, *Preview* y
   *Development*:

   | Variable | Valor |
   | --- | --- |
   | `DATABASE_URL` | cadena con pooler de Neon |
   | `SESSION_SECRET` | 32 caracteres o más, generado al azar |

3. **Deploy.**

Cada push a `main` va a producción y cada pull request genera su propia vista
previa. La CI de GitHub Actions comprueba tipos, estilo, tests y build; no
despliega nada.

### 4. Cuenta de administrador

El rol no se puede pedir desde el formulario de registro. Se concede así:

```bash
ADMIN_USERNAME=admin ADMIN_EMAIL=admin@ejemplo.com ADMIN_PASSWORD='...' npm run db:seed
```

O directamente en la base de datos:

```sql
UPDATE users SET role = 'admin' WHERE username = 'tu-usuario';
```

---

## Cómo encaja

```
                    ┌──────────────────────────────┐
   navegador ──────►│  Vercel (un solo proyecto)   │
                    │                              │
                    │  /            → web/dist     │  estático, CDN
                    │  /api/*       → función Hono │  Node 22
                    └───────────┬──────────────────┘
                                │
                  ┌─────────────┴─────────────┐
                  ▼                           ▼
          ┌───────────────┐          ┌────────────────┐
          │ Neon Postgres │          │  api.binance   │
          │  (WebSocket)  │          │  precios, 24h  │
          └───────────────┘          └────────────────┘
```

Toda la API es **una sola función** con Hono enrutando por dentro. Un fichero por
endpoint habría superado el límite de funciones del plan gratuito y multiplicado
los arranques en frío.

Las rutas públicas de mercado responden con `Cache-Control: s-maxage`, así que la
CDN sirve la mayoría de las peticiones y Binance recibe como mucho una por
ventana, aunque haya mil pestañas abiertas.

---

## Cambios en el esquema

```bash
# 1. Editar server/src/db/schema.ts
# 2. Generar la migración
npm run db:generate
# 3. Revisar el SQL en server/drizzle/
# 4. Aplicarla
npm run db:migrate
```

Las migraciones se versionan y los tests corren sobre ellas, de modo que una
migración rota hace fallar la CI.

---

## Aplicación Android (opcional)

El proyecto incluye un contenedor de Capacitor. La API acepta también
`Authorization: Bearer`, porque el navegador embebido sirve desde otro origen y
no adjunta la cookie de sesión.

```bash
npm run build --workspace web
npm run cap:sync --workspace web
npx cap open android   # requiere Android Studio
```

---

## Alternativa: frontend en GitHub Pages

Es posible, pero **no es lo recomendable**: GitHub Pages solo sirve ficheros
estáticos, así que la API tendría que seguir en Vercel y pasarían a ser dos
orígenes distintos. Eso obliga a configurar `CORS_ORIGIN`, a que la cookie sea
`SameSite=None; Secure` y a lidiar con los navegadores que bloquean cookies de
terceros. Con todo en Vercel no hay ninguno de esos problemas y el despliegue es
uno solo.
