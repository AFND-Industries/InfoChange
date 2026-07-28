# Notas del despliegue en Vercel

Cinco cosas que solo fallaron ya desplegado y no las detectaba ninguna
comprobación local. Se documentan porque son decisiones que parecen arbitrarias
al leer el código y no lo son.

Todas están cubiertas ahora por `npm run check:bundle`, que compila y ejecuta la
función igual que Vercel y forma parte de `verify` y de la integración continua.

---

## 1. Nada de `ws`: el WebSocket nativo

El driver de Neon habla por WebSocket. La forma habitual es pasarle el paquete
`ws`, pero es CommonJS y hace `require()` por dentro: al empaquetar la función
como ESM reventaba al cargar el módulo con `Dynamic require of "events" is not
supported`, antes siquiera de atender la petición.

`WebSocket` es global desde Node 22, que es lo que fija `engines`. Sin `ws`.

## 2. El enrutado no va por el nombre del fichero

`api/[...route].ts` **no** se comporta como comodín en Vercel: resultó ser un
parámetro de un solo segmento. `/api/health` llegaba y `/api/market/tokens`
devolvía 404.

La función se llama `api/index.ts` y la reescritura de `vercel.json` manda todo
`/api/*` allí pasando la ruta original en una captura explícita:

```json
{ "source": "/api/(.*)", "destination": "/api?__path=$1" }
```

`restoreOriginalUrl()` la reconstruye antes de entregársela a Hono.

## 3. Los imports relativos llevan `.js`

Vercel **no empaqueta** la función: la transpila con TypeScript y deja que Node
resuelva los módulos. En ESM eso obliga a escribir la extensión, y sin ella Node
no encuentra nada.

Por eso el `tsconfig` del servidor y el de la función usan
`moduleResolution: NodeNext` en lugar de `bundler`: para que `tsc --noEmit` lo
verifique en cada ejecución.

## 4. La conversión de la petición se hace a mano

Ninguno de los dos adaptadores disponibles funciona en este runtime:

| Adaptador | Qué pasa |
| --- | --- |
| `@hono/node-server/vercel` | Las GET responden; las **POST se quedan colgadas** hasta agotar la invocación, sin ejecutar la ruta |
| `hono/vercel` | Espera la firma Web (`Request` → `Response`), pero Vercel invoca con `(req, res)`: falla **todo** |

`api/index.ts` lee el cuerpo del flujo de Node, construye la `Request`, llama a
`app.fetch` y vuelca la `Response`, tratando aparte las cabeceras `set-cookie`,
que pueden ser varias. Son treinta líneas y el comportamiento es idéntico en
producción, en local y en la comprobación.

## 5. La función corre en Europa

Binance responde **451 a las peticiones desde Estados Unidos**, y la región por
defecto de Vercel es Washington. Todas las rutas de mercado devolvían 502
mientras el resto funcionaba.

`vercel.json` fija `"regions": ["cdg1"]` (París). El cliente de Binance
distingue el caso y devuelve `MARKET_REGION_BLOCKED`, que dice que el problema es
la región del servidor y no el mercado.

---

## Cómo se diagnosticó

Vale la pena anotarlo porque tres hipótesis razonables resultaron falsas.

Con los login agotando los 15 segundos y las lecturas de base de datos
respondiendo en 200 ms, lo aparente era que el hash de contraseñas consumía la
invocación. Se midió en lugar de suponer:

| Hipótesis | Medida | Veredicto |
| --- | --- | --- |
| La CPU está limitada | scrypt síncrono: 3,6 ms en Vercel, 2,2 ms en local | Falsa |
| El threadpool está estrangulado | scrypt asíncrono: 3,5 ms | Falsa |
| Alguna consulta de Drizzle cuelga | select simple, con parámetro y API relacional: 100 ms las tres | Falsa |

Descartado todo eso, lo único que separaba a las rutas que funcionaban de las que
no era el **método HTTP**: todas las GET respondían y todas las POST agotaban la
invocación. De ahí el adaptador.

También hubo un espejismo: `/api/auth/security-questions` parecía demostrar que
la base de datos funcionaba, pero podía ser caché de CDN. Forzando un parámetro
aleatorio se confirmó que era una consulta real de 243 ms.

**La lección de fondo**: el typecheck, el lint, los tests y el build revisan el
código fuente; ninguno ejecutaba el artefacto que se despliega. Y cuando se
añadió una comprobación que sí lo hacía, seguía dando verde porque **solo usaba
GET**, que era justo lo que funcionaba. Ahora cubre ambos métodos.

## Pendiente

La base de datos está en `us-east-2` (Ohio) y la función en París: cada consulta
cruza el Atlántico. Funciona —una operación completa tarda menos de un segundo—
pero mover el proyecto de Neon a `eu-central-1` ahorraría unos 100 ms por
consulta. Implica crear un proyecto nuevo y volver a lanzar `db:migrate` y
`db:seed`.
