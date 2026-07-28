# Contrato de migración del frontend (v1 → v2)

Documento de trabajo para la refactorización. Describe qué sustituye a qué.
Una vez completada la migración puede archivarse.

## Principios

1. **No se rediseña la interfaz.** Se conserva el marcado, las clases de
   Bootstrap y los textos. Cambia cómo se obtienen los datos, no cómo se ven.
2. **Nada de acceso directo al DOM.** Ni `document.getElementById`, ni
   `innerHTML`, ni `window.onkeydown`, ni `new bootstrap.X(...)`.
3. **Los importes llegan como cadena** para no perder precisión. Se convierten a
   número solo al formatear, con los ayudantes de `src/lib/format.ts`.
4. **Un error no es "el servidor está caído".** `ApiError` trae `status` y `code`;
   se muestra `error.message`, que ya viene redactado en español.

## Hooks disponibles

| Antes | Ahora | Origen |
| --- | --- | --- |
| `useAuth().getActualUser()` | `useSession().user` | `hooks/useSession` |
| `useAuth().getActualUserWallet()` | `useSession().balances` | `hooks/useSession` |
| `useAuth().getAuthStatus()` | `useSession().status` | `hooks/useSession` |
| `useAuth().doLogin(u, p)` | `useLogin()` | `hooks/useSession` |
| `useAuth().doLogout()` | `useLogout()` | `hooks/useSession` |
| `useAuth().doRegister(user)` | `useRegister()` | `hooks/useSession` |
| `useAuth().doCheckEmail(email)` | `endpoints.auth.checkEmail(email)` | `lib/endpoints` |
| `useAPI().doSwap()` | `useToggleUiMode()` | `hooks/useSession` |
| `useAPI().getPair(s)` | `usePair(s)` | `hooks/useMarket` |
| `useAPI().getPairPrice(s)` | `usePairPrice(s)` | `hooks/useMarket` |
| `useAPI().getTokenInfo(a)` | `useTokenLookup()(a)` | `hooks/useMarket` |
| `useAPI().filterPairs(...)` | `useSymbols()` + filtro local | `hooks/useMarket` |
| `useCoins().getCoins()` | `useCoins().data?.coins` | `hooks/useMarket` |
| `useAPI().doTrade(...)` | `useTrade()` | `hooks/useWallet` |
| `useAPI().doBizum(...)` | `useTransfer()` | `hooks/useWallet` |
| `useAPI().buyProduct(...)` | `useDeposit()` | `hooks/useWallet` |
| `useAPI().withdrawBalance(...)` | `useWithdraw()` | `hooks/useWallet` |
| `useAPI().doBizumUsers()` | `useRecipients(q)` | `hooks/useWallet` |
| `useAPI().doTradeHistory()` | `useTradeHistory()` | `hooks/useHistory` |
| `useAPI().doPaymentHistory()` | `usePaymentHistory()` | `hooks/useHistory` |
| `useAPI().doBizumHistory()` | `useTransferHistory()` | `hooks/useHistory` |
| volcado de `/admin` | `useAdminOverview()` | `hooks/useHistory` |

Las mutaciones son de React Query: `const trade = useTrade();` y luego
`await trade.mutateAsync({ symbol, quantity, side })`. Exponen `isPending`,
`error` y `reset()`. Al completarse invalidan solas la sesión y los saldos, así
que **no hay que refrescar nada a mano**.

## Cambios en los datos

| Concepto | Antes | Ahora |
| --- | --- | --- |
| Posición de cartera | `{ coin, quantity }` | `{ asset, quantity }` (cadena) |
| Usuario | `user.profile.firstName` | `user.firstName` |
| Modo de interfaz | `profile.mode` | `user.uiMode` |
| Administrador | `profile.firstName === "admin"` | `user.role === "admin"` / `useSession().isAdmin` |
| Operación | `{ type, paid_amount, amount_received, comission, date }` | `{ side, paidAsset, paidAmount, receivedAsset, receivedAmount, fee, executedAt }` |
| Pago | `{ type: "PAY"/"WITHDRAW", quantity, date, info }` | `{ kind: "DEPOSIT"/"WITHDRAWAL", amount, createdAt, methodReference }` |
| Transferencia | `{ sender, receiver, quantity, date }` | `{ senderId, recipientId, amount, createdAt }` |
| Moneda (listado) | `{ symbol, lastPrice, ... }` | `{ symbol, baseAsset, name, logo, price, priceChangePercent, ... }` |
| Ficha de activo | `CoinMarketCapData.data[X][0]` | `useTokenLookup()(X)` → `{ name, logo, slug }` |
| Descripción larga | mismo objeto | `useTokenDetails()` → `{ description, urls, tags }` |

## Interacciones

| Antes | Ahora |
| --- | --- |
| `new bootstrap.Toast(...)` + `innerHTML` | `useToast().success(titulo, texto)` |
| `new bootstrap.Modal(...)` | `<Modal show={...} onHide={...}>` de react-bootstrap |
| `new bootstrap.Popover(...)` | `<OverlayTrigger overlay={<Popover>...}>` |
| `getElementById("loading-screen").style` | `<BusyOverlay show={mutation.isPending} />` |
| `window.onkeydown = ...` | `onKeyDown` en el elemento, o `useEffect` con su `removeEventListener` |

## Formularios de pago

El medio de pago viaja como unión discriminada y el servidor **no guarda** el
número completo, el CVV ni ninguna contraseña; solo una referencia enmascarada.

```js
{ type: "CARD",   holder, number, expiry: "MM/AA", cvv }
{ type: "IBAN",   holder, iban }
{ type: "PAYPAL", email }
```

`useDeposit()` / `useWithdraw()` reciben `{ amount, method }`, donde `amount` es
una cadena con un número positivo.
