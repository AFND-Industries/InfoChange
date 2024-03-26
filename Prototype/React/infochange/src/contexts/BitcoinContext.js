import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BitcoinContext = createContext();

export const BitcoinProvider = ({ children, p }) => {
    const [bitcoinCandle, setBitcoinCandle] = useState(null);

    const pair = p || "btcusdt";
    const [timeScale, setTimeScale] = useState("1h");
    const [bitcoinPrice, setBitcoinPrice] = useState(-1);
    const [dollarBalance, setDollarBalance] = useState(1000);
    const [bitcoinBalance, setBitcoinBalance] = useState(1);

    const getBitcoinCandle = () => {
        if (bitcoinCandle != null && parseFloat(bitcoinPrice) > 0)
            bitcoinCandle.close = bitcoinPrice;

        return bitcoinCandle;
    };

    const getPair = () => pair;
    const getTimeScale = () => timeScale;
    const getBitcoinPrice = () => bitcoinPrice.toFixed(2);
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

    /*async function getSymbols() {
        try {
            const response = await axios.get(' https://api.binance.com/api/v1/exchangeInfo');
            // mapping needed
            const data = response.data;
            console.log(data);
        } catch (error) {
            console.error('Hubo un error al obtener el historial de precios de Bitcoin:', error);
        }

    }
    getSymbols();*/ // WORKING ON

    async function getBitcoinPriceHistory() {
        try {
            const response = await axios.get('https://api.binance.com/api/v3/klines', {
                params: {
                    symbol: pair.toUpperCase(),
                    interval: timeScale,
                    limit: 1000,
                }
            });
            console.log("Candles:", response.data.length);

            const data = response.data;
            const cdata = data.map(d => {
                return { time: d[0] / 1000, open: parseFloat(d[1]), high: parseFloat(d[2]), low: parseFloat(d[3]), close: parseFloat(d[4]) }
            });

            if (parseFloat(getBitcoinPrice()) < 0)
                setBitcoinPrice(cdata[data.length - 1].close);

            return cdata;
        } catch (error) {
            console.error('Hubo un error al obtener el historial de precios de Bitcoin:', error);
        }
    }

    useEffect(() => {
        let ws;

        const connectToWebSocket = () => {
            console.log("Trying to make connection to Binance (Candles)...");
            ws = new WebSocket("wss://stream.binance.com:9443/ws/" + pair + "@kline_" + timeScale);

            ws.onmessage = (event) => {
                const d = JSON.parse(event.data);
                const pl = { time: d.k.t.toFixed(0) / 1000, open: parseFloat(d.k.o), high: parseFloat(d.k.h), low: parseFloat(d.k.l), close: parseFloat(d.k.c) }
                setBitcoinCandle(pl);
            };

            ws.onclose = function () {
                console.log("Connection to Binance lost (Candles)...");
                setTimeout(connectToWebSocket, 5000);
            };
        };

        connectToWebSocket();

        return () => {
            ws.close();
        };
    }, []);

    useEffect(() => {
        let ws;

        const connectToWebSocket = () => {
            console.log("Trying to make connection to Binance (Price)...");
            ws = new WebSocket("wss://stream.binance.com:9443/ws/" + pair + "@trade");

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
        <BitcoinContext.Provider
            value={{
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
        </BitcoinContext.Provider>
    );
};

export const useBitcoin = () => useContext(BitcoinContext);
