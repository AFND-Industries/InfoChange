# API

Base: `/api`. Toda la API es una única función serverless con Hono enrutando por
dentro.

**Autenticación.** Cookie `infochange_session` (`httpOnly`, `SameSite=Lax`,
`Secure` en producción) con un JWT firmado. También se acepta
`Authorization: Bearer <token>`, que es lo que usa la aplicación Android.

**Importes.** Siempre cadenas, nunca números en coma flotante, para no perder
precisión en el JSON.

**Errores.** Código HTTP correcto más un cuerpo uniforme:

```json
{ "error": { "code": "INSUFFICIENT_BALANCE", "message": "No tienes suficiente USDT." } }
```

Los errores de validación añaden `details: [{ field, message }]`.

| Código | Significado |
| --- | --- |
| `VALIDATION_ERROR` | Datos mal formados (400) |
| `UNAUTHORIZED` | Falta sesión o no es válida (401) |
| `FORBIDDEN` | Sesión válida sin permisos (403) |
| `ACCOUNT_EXISTS` | Usuario o correo ya registrado (409) |
| `INSUFFICIENT_BALANCE` | Saldo insuficiente (400) |
| `RECIPIENT_NOT_FOUND` | El destinatario no existe (404) |
| `UNKNOWN_SYMBOL` | Par no negociable (404) |
| `TOO_MANY_REQUESTS` | Límite de peticiones (429) |
| `MARKET_UNAVAILABLE` | Binance no responde (502) |

---

## Sesión

| Método y ruta | Descripción |
| --- | --- |
| `GET /auth/security-questions` | Preguntas de seguridad disponibles |
| `POST /auth/register` | Alta de cuenta. Devuelve sesión y 10.000 USDT de bienvenida |
| `POST /auth/login` | `{ username, password }`. `username` acepta también el correo |
| `POST /auth/logout` | Cierra la sesión |
| `GET /auth/me` | Usuario **y** saldos en una sola respuesta |
| `POST /auth/me/ui-mode` | Alterna interfaz sencilla / avanzada |
| `POST /auth/check-email` | `{ email }` → `{ available }` |

El rol no se puede pedir en el registro: se concede desde la base de datos.

## Mercado (público, cacheado en la CDN)

| Ruta | Caché | Descripción |
| --- | --- | --- |
| `GET /market/tokens` | 24 h | Catálogo de nombres, logos y slugs |
| `GET /market/symbols` | 1 h | Pares negociables, en vivo desde Binance |
| `GET /market/prices` | 10 s | Todos los precios, o uno con `?symbol=` |
| `GET /market/coins` | 60 s | Resumen de 24 h de los pares contra USDT |
| `GET /health` | — | Comprobación de estado |

## Cartera (requiere sesión)

| Método y ruta | Cuerpo | Descripción |
| --- | --- | --- |
| `GET /wallet` | | Posiciones con saldo |
| `GET /wallet/recipients?q=` | | Destinatarios posibles, con búsqueda |
| `POST /wallet/trade` | `{ symbol, quantity, side }` | Compraventa. `side`: `BUY` o `SELL` |
| `POST /wallet/transfers` | `{ recipientId, amount }` | Transferencia entre usuarios |
| `POST /wallet/deposits` | `{ amount, method }` | Ingreso simulado |
| `POST /wallet/withdrawals` | `{ amount, method }` | Retirada simulada |

El medio de pago es una unión discriminada:

```json
{ "type": "CARD",   "holder": "...", "number": "...", "expiry": "MM/AA", "cvv": "..." }
{ "type": "IBAN",   "holder": "...", "iban": "..." }
{ "type": "PAYPAL", "email": "..." }
```

Se valida entero, pero **solo se almacena una referencia enmascarada**
(`**** **** **** 1111`). El CVV nunca se guarda.

En `trade`, `quantity` es siempre lo que se **entrega**: en una compra son
unidades del activo de cotización y en una venta del activo base. La comisión
(0,065 %) se descuenta antes de la conversión.

## Historial (requiere sesión)

| Ruta | Descripción |
| --- | --- |
| `GET /history/trades` | Últimas 200 operaciones |
| `GET /history/payments` | Ingresos y retiradas |
| `GET /history/transfers` | Transferencias enviadas y recibidas |

## Administración (requiere rol `admin`)

| Ruta | Descripción |
| --- | --- |
| `GET /admin/overview` | Métricas agregadas del exchange |

Devuelve totales, ranking de usuarios por saldo, activos por volumen y las
últimas transferencias y pagos. Los cálculos se hacen en el servidor: la versión
anterior volcaba la base de datos entera al navegador cada diez segundos.

---

## Límites de peticiones

| Ruta | Límite |
| --- | --- |
| `POST /auth/login` | 10 cada 15 min |
| `POST /auth/register` | 5 por hora |
| `POST /auth/check-email` | 30 cada 10 min |
| `POST /wallet/trade` | 60 por minuto |
| `POST /wallet/transfers` | 30 por minuto |
| Ingresos y retiradas | 20 por minuto |

El contador es por instancia serverless, así que el límite es aproximado: sirve
para cortar el abuso desde un mismo origen, no como cuota exacta.
