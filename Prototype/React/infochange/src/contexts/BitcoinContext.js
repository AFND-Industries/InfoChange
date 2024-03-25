import React, { createContext, useContext, useState, useEffect } from 'react';

const BitcoinContext = createContext();

export const BitcoinProvider = ({ children }) => {
    const [bitcoinPrice, setBitcoinPrice] = useState(0);
    const [dollarBalance, setDollarBalance] = useState(1000);
    const [bitcoinBalance, setBitcoinBalance] = useState(1);

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
            console.log("Trying to make connection to Binance...");
            ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

            ws.onmessage = (event) => {
                const stockObject = JSON.parse(event.data);
                const actualPrice = parseFloat(stockObject.p);
                setBitcoinPrice(actualPrice);
            };

            ws.onclose = function () {
                console.log("Connection to Binance lost...");
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
