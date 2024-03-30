import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import CoinMarketCapData from "../data/CoinMarketCapData.json";
import Symbols from "../data/Symbols.json";

const AssetContext = createContext();

export const AssetProvider = ({ children, p }) => {
    const [bitcoinCandle, setBitcoinCandle] = useState(null);

    const pair = p || "btcusdt"; // en vez de recargar la pagina con la barra de busqueda setear el pair distinto y cambiar con route
    // METER EL GETSYMBOLS EN UN FICHERO Y QUE CADA CIERTO TIEMPO SE RE-RECARGUE Y ASI ELIMINAR ESTA VARIABLE
    // PAIR METIENDOLA DIRECTAMENTE EN SYMBOL Y USANDO GETACTUALSYMBOL
    const [timeScale, setTimeScale] = useState("1d");
    const [bitcoinBalance, setBitcoinBalance] = useState(1);
    const [symbols, setSymbols] = useState(null);

    const [bitcoinPrice, setBitcoinPrice] = useState(-1);
    const [dollarBalance, setDollarBalance] = useState(1000);

    const [actualSymbol, setActualSymbol] = useState({
        symbol: null,
        baseAsset: null,
        quoteAsset: null,
        decimalPlaces: null,
        step: null,
    });

    const getBitcoinCandle = () => {
        if (bitcoinCandle != null && parseFloat(bitcoinPrice) > 0)
            bitcoinCandle.close = bitcoinPrice;

        return bitcoinCandle;
    };

    const getActualSymbol = () => actualSymbol;
    const getPair = () => actualSymbol.symbol == null ? pair : actualSymbol.symbol;
    const getTimeScale = () => timeScale;
    const getBitcoinPrice = () => actualSymbol.decimalPlaces == null ? bitcoinPrice.toString() : bitcoinPrice.toFixed(actualSymbol.decimalPlaces);
    const getBitcoinBalance = () => bitcoinBalance.toFixed(8);
    const getDollarBalance = () => dollarBalance.toFixed(2);

    const buyBitcoin = (amountInDollars) => {
        const bitcoinAmount = parseFloat((amountInDollars / getBitcoinPrice()).toFixed(8));

        setBitcoinBalance(parseFloat(getBitcoinBalance()) + bitcoinAmount);
        setDollarBalance(parseFloat(getDollarBalance()) - amountInDollars);
    }

    const sellBitcoin = (bitcoinAmount) => {
        const amountInDollars = parseFloat((bitcoinAmount * getBitcoinPrice()).toFixed(2));

        setBitcoinBalance(parseFloat(getBitcoinBalance()) - bitcoinAmount);
        setDollarBalance(parseFloat(getDollarBalance()) + amountInDollars);
    };

    function getTokenInfo(token) {
        return CoinMarketCapData.data[token.toUpperCase()][0];
    }

    function filterPairs(regex = "", limit = 10) {
        if (symbols == null)
            return [];

        return Object.values(symbols).filter(s => s.symbol.startsWith(regex.toUpperCase())).slice(0, limit);
    }

    function getDecimals(tickSize) {
        tickSize = tickSize.replace(",", ".");

        if (tickSize[0] !== '0')
            return 0;

        const point = tickSize.indexOf('.');

        let d = 0;
        for (let i = point + 1; i < tickSize.length; i++) {
            if (tickSize[i] === '0') d++;
            else break;
        }

        return d + 1;
    }

    async function getSymbols() {
        const time = Math.floor(Date.now() / 1000);

        const responsePrices = await axios.get('https://api.binance.com/api/v1/ticker/price');
        const dataPrices = responsePrices.data;

        if (true && time - Symbols.timer < 86400000) {
            console.log("Loading symbols info from local cache");

            const symbolsWithPrice = Symbols.symbols.map(s => {
                const priceData = dataPrices.find(price => price.symbol === s.symbol);
                const price = priceData ? parseFloat(priceData.price).toFixed(s.decimalPlaces) : "-";

                return {
                    ...s,
                    price: price
                };
            });

            setSymbols(symbolsWithPrice);
        } else {
            try {
                console.log("Loading symbols info from API");
                const response = await axios.get('https://api.binance.com/api/v1/exchangeInfo');
                const data = response.data;
                const pairs = data.symbols.map(s => ({
                    symbol: s.symbol,
                    baseAsset: s.baseAsset,
                    quoteAsset: s.quoteAsset,
                    decimalPlaces: getDecimals(s.filters.find(filter => filter.filterType === 'PRICE_FILTER').tickSize),
                    step: s.filters.find(filter => filter.filterType === 'PRICE_FILTER').tickSize,
                }));

                setSymbols(pairs);
                console.log({
                    timer: Math.floor(Date.now() / 1000),
                    symbols: pairs
                });
                /* GUARDAR EN SYMBOLS.JSON */
                // El navegador no tiene acceso al sistema de ficheros, hay que hacerlo con backend, cosa que no sé aún
                // por eso, de momento seguir usando la peticion
            } catch (error) {
                console.error('Error getSymbols:', error);
            }
        }
    }

    useEffect(() => {
        if (symbols != null) {
            const symbol = Object.values(symbols).find(s => s.symbol === pair.toUpperCase());

            setActualSymbol(symbol);
        }
    }, [symbols])

    useEffect(() => {
        getSymbols();
    }, [])

    async function getBitcoinPriceHistory() {
        try {
            const response = await axios.get('https://api.binance.com/api/v3/klines', {
                params: {
                    symbol: pair.toUpperCase(),
                    interval: timeScale,
                    limit: 10000,
                }
            });

            const data = response.data;
            const cdata = data.map(d => {
                return { time: d[0] / 1000, open: parseFloat(d[1]), high: parseFloat(d[2]), low: parseFloat(d[3]), close: parseFloat(d[4]) }
            });

            // Normally API is done before WebSocket connection. We can get an initial data from this
            setBitcoinCandle(cdata[cdata.length - 1]);
            setBitcoinPrice(cdata[data.length - 1].close);

            return cdata;
        } catch (error) {
            console.error('Hubo un error al obtener el historial de precios de Bitcoin:', error);
        }
    }

    useEffect(() => {
        if (timeScale == null)
            return;

        let ws;
        let manuallyClosed = false;

        const connectToWebSocket = () => {
            console.log("Trying to make connection to Binance (Candles)...");
            ws = new WebSocket("wss://stream.binance.com:9443/ws/" + pair.toLowerCase() + "@kline_" + timeScale);

            ws.onmessage = (event) => {
                const d = JSON.parse(event.data);
                const pl = { time: d.k.t.toFixed(0) / 1000, open: parseFloat(d.k.o), high: parseFloat(d.k.h), low: parseFloat(d.k.l), close: parseFloat(d.k.c) }

                setBitcoinCandle(pl);
            };

            ws.onclose = function () {
                console.log("Connection to Binance lost (Candles)...");
                if (!manuallyClosed)
                    setTimeout(connectToWebSocket, 5000);
            };
        };

        connectToWebSocket();

        return () => {
            manuallyClosed = true;
            ws.close();
        };
    }, [timeScale]);

    useEffect(() => {
        let ws;

        const connectToWebSocket = () => {
            console.log("Trying to make connection to Binance (Price)...");
            ws = new WebSocket("wss://stream.binance.com:9443/ws/" + pair.toLowerCase() + "@trade");

            ws.onmessage = (event) => {
                const stockObject = JSON.parse(event.data);
                const actualPrice = parseFloat(stockObject.p);

                setBitcoinPrice(actualPrice);
            };

            ws.onclose = function () {
                console.log("Connection to Binance lost (Price)...");
                setTimeout(connectToWebSocket, 5000);
            };
        };

        connectToWebSocket();

        return () => {
            ws.close();
        };
    }, []);

    return (
        <AssetContext.Provider
            value={{
                setTimeScale,
                filterPairs,
                getTokenInfo,
                getActualSymbol,
                getPair,
                getTimeScale,
                getBitcoinPriceHistory,
                getBitcoinCandle,
                getBitcoinPrice,
                getDollarBalance,
                getBitcoinBalance,
                buyBitcoin,
                sellBitcoin,
            }}
        >
            {children}
        </AssetContext.Provider>
    );
};

export const useAsset = () => useContext(AssetContext);
