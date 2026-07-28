# Estado de las dependencias

`npm audit` no devuelve cero, así que conviene explicar qué queda y por qué.
El punto de partida eran **314 vulnerabilidades** en la rama `main` de la v1.

| Alcance | Críticas | Altas | Moderadas |
| --- | --- | --- | --- |
| **Producción** (lo que se despliega) | 0 | 2 | 1 |
| Herramientas de desarrollo | 1 | 9 | 4 |

Nada de lo que queda afecta a la aplicación desplegada. El detalle, aviso por
aviso, está abajo.

---

## Corregidas

| Paquete | De | A | Problema |
| --- | --- | --- | --- |
| `drizzle-orm` | 0.38 | 0.45.2 | **Inyección SQL** por identificadores mal escapados. La única que estaba en el camino de ejecución de la API. |
| `jspdf` | 2.5 | 4.2.1 | Denegación de servicio por expresión regular (ReDoS). |
| `jspdf-autotable` | 3.8 | 5.0.8 | Arrastraba una copia vulnerable de `jspdf`. |
| `react-router-dom` | 6.22 | 7.18.1 | **Redirección abierta** con barra invertida (CVE-2025-68470). |
| `vite` | 5 | 7 | Path traversal en el manejo de `.map`. |
| `vitest` | 2 | 4 | Lectura y ejecución de ficheros arbitrarios con la interfaz web activa. |
| `npm-run-all2` | 7 | 8 | Cadena vulnerable de `minimatch`. |

El salto de `jspdf` de 2 a 4 rompía la exportación a PDF: desde
`jspdf-autotable` 5 el complemento ya no añade `autoTable` al prototipo de
`jsPDF` y hay que llamar a `autoTable(doc, opciones)`. Está corregido y
verificado en un navegador real: el informe sale con sus tres páginas.

---

## Lo que queda en producción

### `react-router` — CSRF en modo RSC (alta)

El aviso afecta al **modo RSC** (React Server Components) de React Router. Esta
aplicación es una SPA con `BrowserRouter` y no usa RSC en ningún punto, así que
el código vulnerable no llega a ejecutarse.

No hay ninguna versión libre de los dos avisos a la vez: la redirección abierta
está corregida a partir de 7.17.1 y el problema de RSC abarca de 7.12.0 a 8.2.0.
Se prioriza cerrar la redirección abierta, que sí era explotable aquí.

Además, la aplicación **no depende de que lo arregle la librería**: la validación
del destino tras iniciar sesión rechaza por su cuenta las barras invertidas.

```js
function safeRedirect(from) {
  if (typeof from !== "string") return "/dashboard";
  const interna = /^\/[^/\\]/.test(from) || from === "/";
  return interna && !from.includes("\\") ? from : "/dashboard";
}
```

### `@hono/node-server` — path traversal en `serve-static` (moderada)

Afecta al middleware de ficheros estáticos, que **este proyecto no importa en
ningún sitio**: los estáticos los sirve la CDN de Vercel. Del paquete solo se usa
`serve` (servidor local de desarrollo) y `handle` (adaptador de Vercel).

Se mantiene la rama 1.x a propósito: la 2.x **eliminó el subpath
`@hono/node-server/vercel`**, que es el adaptador con el que se despliega la API.
Actualizar rompería el despliegue a cambio de cerrar un aviso sobre código que no
se ejecuta.

---

## Lo que queda en herramientas de desarrollo

Ninguno de estos paquetes se despliega: solo se ejecutan en tu máquina o en la
integración continua, sobre este mismo código.

| Paquete | Por qué se queda |
| --- | --- |
| `@capacitor/cli` y sus `tar`, `rimraf`, `glob` | Solo interviene al empaquetar la aplicación Android (`npm run cap:sync`). Actualizar a la 8 obliga a subir todo el conjunto de Capacitor. |
| `eslint` y su cadena `minimatch` / `brace-expansion` | El arreglo es ESLint 10, un cambio mayor que toca la configuración de los dos paquetes del monorepo. |
| `eslint-plugin-react` | Misma cadena de `minimatch`. |

Son denegaciones de servicio y escrituras de ficheros que exigen ejecutar la
herramienta contra una entrada preparada. En un repositorio donde la entrada es
tu propio código, el riesgo es teórico.

---

## Cómo comprobarlo

```bash
npm audit --omit=dev   # solo lo que se despliega
npm audit              # todo, incluidas las herramientas
```

Cuando ESLint 10 y Capacitor 8 se aborden, ambos números deberían llegar a cero.
