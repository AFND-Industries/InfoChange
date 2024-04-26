import React, { createContext, useContext, useState, useEffect } from "react";

import Symbols from "../../../data/Symbols.json";
import CoinMarketCapData from "../../../data/CoinMarketCapData.json";
import axios from 'axios';

const TradingContext = createContext();

export const TradingProvider = ({ children }) => {
    const [symbols, setSymbols] = useState(Symbols.symbols);
    const reloadPricesTime = 15000;

    function getPair(symbol) {
        return Object.values(symbols).filter(s => s.symbol == symbol)[0];
    }

    function getTokenInfo(token) {
        return CoinMarketCapData.data[token.toUpperCase()][0];
    }

    function filterPairs(regex = "") {
        if (symbols == null)
            return [];

        return Object.values(symbols).filter(s =>
            s.baseAssetName.toUpperCase().startsWith(regex.toUpperCase()) ||
            s.symbol.startsWith(regex.toUpperCase()));
    }

    useEffect(() => {
        const loadPrices = async () => {
            try {
                const responsePrices = await axios.get('https://api.binance.com/api/v1/ticker/price');
                const dataPrices = responsePrices.data;

                console.log("Updating prices " + new Date().toLocaleString());
                const symbolsWithPrice = Symbols.symbols.map(s => {
                    const priceData = dataPrices.find(price => price.symbol === s.symbol);
                    const price = priceData ? parseFloat(priceData.price).toFixed(s.decimalPlaces) : "-";

                    return {
                        ...s,
                        price: price
                    };
                });

                setSymbols(symbolsWithPrice);
            } catch (error) {
                console.error('Error fetching prices:', error);
            }
        };

        loadPrices();

        const intervalId = setInterval(() => {
            loadPrices();
        }, reloadPricesTime);

        return () => clearInterval(intervalId);
    }, []);



    return (
        <TradingContext.Provider
            value={{
                getPair,
                getTokenInfo,
                filterPairs,
            }}
        >
            {children}
        </TradingContext.Provider>
    );
}

export const useTrading = () => useContext(TradingContext);