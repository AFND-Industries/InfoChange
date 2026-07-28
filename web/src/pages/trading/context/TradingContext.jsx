import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { usePair, usePairPrice, useSymbols } from "../../../hooks/useMarket";
import { useSession } from "../../../hooks/useSession";

const TradingContext = createContext(null);

const DEFAULT_SYMBOL = "BTCUSDT";

/**
 * Par seleccionado y modo de interfaz de la pantalla de trading.
 *
 * El par vive en la URL y no en un estado propio del contexto. La version
 * anterior guardaba una copia en `useState` y ademas reescribia la barra de
 * direcciones a mano con `window.history.replaceState`, de forma que el router
 * nunca se enteraba del cambio: al volver atras la URL y la pantalla contaban
 * cosas distintas.
 */
export function TradingProvider({ children }) {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useSession();

  const symbol = (params.pair ?? DEFAULT_SYMBOL).toUpperCase();
  const { isPending, error } = useSymbols();
  const pair = usePair(symbol);
  const price = usePairPrice(symbol);

  // La direccion se normaliza al simbolo real, tanto si llega en minusculas
  // como si se entra por /trading sin indicar par.
  useEffect(() => {
    if (pair && params.pair !== pair.symbol) {
      navigate(`/trading/${pair.symbol}`, { replace: true });
    }
  }, [navigate, pair, params.pair]);

  const selectPair = useCallback(
    (next) => {
      if (next.symbol !== symbol) navigate(`/trading/${next.symbol}`, { replace: true });
    },
    [navigate, symbol],
  );

  // 0 = novato, 1 = profesional. Se toma de la sesion (se cambia desde el panel
  // de control con `useToggleUiMode`), pero un par que no cotiza contra USDT no
  // se puede presentar en modo novato, que razona siempre en dolares.
  const uiMode = user?.uiMode === 1 ? 1 : 0;
  const mode = uiMode === 0 && pair && pair.quoteAsset !== "USDT" ? 1 : uiMode;

  const value = useMemo(
    () => ({
      /** Simbolo pedido en la URL, exista o no. */
      symbol,
      /** Ficha del par, o `undefined` si el catalogo no lo tiene. */
      pair,
      /** Ultimo precio conocido del par, o `undefined`. */
      price,
      mode,
      selectPair,
      isLoading: isPending,
      error,
    }),
    [symbol, pair, price, mode, selectPair, isPending, error],
  );

  return <TradingContext.Provider value={value}>{children}</TradingContext.Provider>;
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error("useTrading debe usarse dentro de <TradingProvider>.");
  }
  return context;
}
