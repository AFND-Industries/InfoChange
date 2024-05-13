import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

import Symbols from "../../../data/Symbols.json";
import CoinMarketCapData from "../../../data/CoinMarketCapData.json";
import axios from 'axios';

const TradingContext = createContext();

// Cuando haya backend siempre activo, hacer que se pidan los precios cada X tiempo y se guarde con su time actual asi se puede
// conseguir que haya siempre el % cambio, el mini grafico de las monedas con puntos random y cosas asi jeje

// SI VAS A UN SITIO Y TE PIDE LOGEARTE PUES QUE DESPUES DE LOGEARTE TE LLEVE A ESE SITIO
// FILTRAR MONEDAS QUE NO ESTA NEN TRADING VIEW
// ARREGLAR LO DE QUE PUEDES REGISTRARTE EN TRADING VIEW DESDE INFOCHANGE

// SOPORTE CON PAYMENT SI NO TIENES SALDO DISPONIBLE LLEVAR A PAYMENT
// DISEÑO RESPONSIVE
// ELIMINAR LA DATA DUPLICADA

// MOSTRAR EN TRADING ANTES Q HACER FAVORITOS LA LISTA DE MONEDAS QUE TIENES
// HACER PANEL PARA ADMIN CON TODA LA COMISION QUE HA GANAO UNA TABLA ADMIN ALGO ASI WAPO WAPO
// cambiar modo, cambiar grafico, posicion del marquee configurable

const LOSIGUIENTE = 1;

// mirar si se puede cambiar la barra derecha del buscar par
// HACER APICONTEXT Y METER AHI EL tradeCoins y el buyProduct de toni ademas de lo de getCoins de roman y el getPrices mio
// HISTORIAL DE TRANSACCIONES
// se puede poner a parte de en dashboard en trading un boton para ver el historial
// retirar saldo

export const TradingProvider = ({ children }) => {
    const params = useParams();
    const pairPath = params.pair === undefined ? "BTCUSDT" : params.pair.toUpperCase();
    const getPairPath = () => pairPath;

    const [symbols, setSymbols] = useState(Symbols.symbols);
    const reloadPricesTime = 10000;

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
                const responsePrices = await axios.get('http://localhost:1024/prices');
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