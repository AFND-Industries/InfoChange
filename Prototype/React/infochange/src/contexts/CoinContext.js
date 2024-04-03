import React, { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';

import CoinMarketCapData from "../data/CoinMarketCapData.json";
import Symbols from "../data/Symbols.json";

const CoinContext = createContext();

export function CoinProvider({ children }) {
    const [symbols, setSymbols] = useState(null);
    const getSymbols = () => symbols;

    function getTokenInfo(token) {
        return CoinMarketCapData.data[token.toUpperCase()][0];
    }

    function getSymbolInfo(symbol) {
        return Object.values(Symbols.symbols).find(s => s.symbol === symbol)
    }

    async function loadSymbols() {
        const responsePrices = await axios.get('https://api.binance.com/api/v1/ticker/price');
        const dataPrices = responsePrices.data;

        const symbolsWithPrice = Symbols.symbols.map(s => {
            const priceData = dataPrices.find(price => price.symbol === s.symbol);
            const price = priceData ? parseFloat(priceData.price).toFixed(s.decimalPlaces) : "-";

            return {
                ...s,
                price: price
            };
        });

        setSymbols(symbolsWithPrice);
    }

    useEffect(() => {
        loadSymbols();
    }, [])

    return (
        <CoinContext.Provider
            value={{
                getSymbols,
                getTokenInfo,
                getSymbolInfo
            }}
        >
            {children}
        </CoinContext.Provider>
    )
}

export const useCoins = () => useContext(CoinContext);