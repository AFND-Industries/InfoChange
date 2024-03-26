import React, { createContext, useContext, useState, useEffect } from 'react';

const BitcoinContext = createContext();

export const BitcoinProvider = ({ children }) => {
    const [bitcoinCandle, setBitcoinCandle] = useState(null);
    const [bitcoinPrice, setBitcoinPrice] = useState(0);
    const [dollarBalance, setDollarBalance] = useState(1000);
    const [bitcoinBalance, setBitcoinBalance] = useState(1);

    const getBitcoinCandle = () => {
        if (bitcoinCandle != null && parseFloat(bitcoinPrice) > 0)
            bitcoinCandle.close = bitcoinPrice;

        return bitcoinCandle;
    };
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

    useEffect(() => {
        let ws;

        const connectToWebSocket = () => {
            console.log("Trying to make connection to Binance (Candles)...");
            ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_1m");

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
            ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

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
