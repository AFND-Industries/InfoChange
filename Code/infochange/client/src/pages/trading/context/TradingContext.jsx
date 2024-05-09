import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

import Symbols from "../../../data/Symbols.json";
import CoinMarketCapData from "../../../data/CoinMarketCapData.json";
import axios from 'axios';

const TradingContext = createContext();

// Pensar en una posible forma de usar clases con metodos para los simbolos asi el getPrice seria mas sencillo

// Cuando haya backend siempre activo, hacer que se pidan los precios cada X tiempo y se guarde con su time actual asi se puede
// conseguir que haya siempre el % cambio, el mini grafico de las monedas con puntos random y cosas asi jeje

// METER MODO NO LOGEADO QUE SEA NOOB + BOTON CAMBIADO
// MODO NOOB METER VAS A RECIBIR (ESTIMADO) DE BAJO Y QUITAR EL SLIDER
// PONER EN EL MODO NOOB UNA CONFIRMACION 
// PASAR EL FETCH DE COINS AL BACKEND
// FILTRAR MONEDAS QUE NO ESTA NEN TRADING VIEW
// ARREGLAR LO DE QUE PUEDES REGISTRARTE EN TRADING VIEW DESDE INFOCHANGE
// SOPORTE CON PAYMENT ?
// PONER EL NEEDSERVER Y NEEDSAUTH SERIA NEEDAUTS(MNNEDSERVER)

export const TradingProvider = ({ children }) => {
    const params = useParams();
    const pairPath = params.pair === undefined ? "BTCUSDT" : params.pair.toUpperCase();
    const getPairPath = () => pairPath;

    const [symbols, setSymbols] = useState(Symbols.symbols);
    const reloadPricesTime = 15000;

    const [actualPair, setActualPair] = useState(getPair(pairPath));
    const getActualPair = () => actualPair;
    const getActualPairPrice = () => getActualPair() === undefined || symbols[0].price === undefined ? -1 : getPair(getActualPair().symbol).price;

    const [mode, setMode] = useState(0);
    const getTradingMode = () => mode;
    const changeChartMode = () => setMode(mode => (mode + 1) % 2);

    function getPair(symbol) {
        return Object.values(symbols).filter(s => s.symbol == symbol)[0];
    }

    function getTokenInfo(token) {
        return CoinMarketCapData.data[token.toUpperCase()][0];
    }

    function filterPairs(regex = "", quoteRegex = "") {
        if (symbols == null)
            return [];

        return Object.values(symbols).filter(s =>
            (s.baseAssetName.toUpperCase().startsWith(regex.toUpperCase()) || s.symbol.startsWith(regex.toUpperCase()))
            && s.quoteAsset.startsWith(quoteRegex));
    }

    useEffect(() => {
        if (getActualPair() !== undefined)
            window.history.replaceState(null, null, "/trading/" + getActualPair().symbol);
    }, [getActualPair()]);

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
                getActualPair,
                setActualPair,
                getActualPairPrice,
                getTradingMode,
                changeChartMode,
                getPairPath
            }}
        >
            {children}
        </TradingContext.Provider>
    );
}

export const useTrading = () => useContext(TradingContext);