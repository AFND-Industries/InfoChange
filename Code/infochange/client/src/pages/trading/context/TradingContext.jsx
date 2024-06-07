import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAPI } from "../../../context/APIContext";
import { useAuth } from "../../authenticator/AuthContext";

const TradingContext = createContext();

export const TradingProvider = ({ children }) => {
  const { getPair, getPairPrice } = useAPI();
  const { getActualUser } = useAuth();

  const params = useParams();
  const pairPath =
    params.pair === undefined ? "BTCUSDT" : params.pair.toUpperCase();
  const getPairPath = () => pairPath;

  const [actualPair, setActualPair] = useState(getPair(pairPath));
  const getActualPair = () => actualPair;
  const getActualPairPrice = () =>
    getActualPair() === undefined ? -1 : getPairPrice(actualPair.symbol);

  const getTradingMode = () =>
    getActualUser() !== null ? getActualUser().profile.mode : 0;

  useEffect(() => {
    if (getActualPair() !== undefined)
      window.history.replaceState(
        null,
        null,
        "/trading/" + getActualPair().symbol
      );
  }, [getActualPair()]);

  return (
    <TradingContext.Provider
      value={{
        getActualPair,
        setActualPair,
        getActualPairPrice,
        getTradingMode,
        getPairPath,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => useContext(TradingContext);
