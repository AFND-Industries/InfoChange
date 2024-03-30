import React, { createContext, useContext } from "react";

import CoinMarketCapData from "../data/CoinMarketCapData.json";
import Symbols from "../data/Symbols.json";

const CoinContext = createContext();

export function CoinProvider({ children }) {
    function getTokenInfo(token) {
        return CoinMarketCapData.data[token.toUpperCase()][0];
    }

    function getSymbolInfo(symbol) {
        return Object.values(Symbols.symbols).find(s => s.symbol == symbol)
    }

    return (
        <CoinContext.Provider
            value={{
                getTokenInfo,
                getSymbolInfo
            }}
        >
            {children}
        </CoinContext.Provider>
    )
}

export const useCoins = () => useContext(CoinContext);