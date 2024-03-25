import React, { useState, useEffect } from "react";
import { useBitcoin } from "../contexts/BitcoinContext";

function Price() {
    const { getBitcoinPrice } = useBitcoin();
    const [prices, setPrices] = useState([null, null]);
    const textColor = prices[0] === null || prices[0] === prices[1]
        ? "black"
        : prices[1] > prices[0]
            ? "green"
            : "red";

    useEffect(() => {
        const currentPrice = getBitcoinPrice();
        setPrices(prevPrices => [prevPrices[1], currentPrice]);
        document.title = "BTCUSD " + currentPrice;
    }, [getBitcoinPrice]);

    const fecha = new Date().toLocaleString('es-ES', {
        timeZone: 'Europe/Madrid',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });

    return (
        <div className="price m-5">
            <h2 className="text-center mb-2">Precio de Bitcoin</h2>
            <div className="card mx-auto" style={{ maxWidth: "400px" }}>
                <div className="card-body text-center">
                    <h3 className="card-title m-0" style={{ ...{ fontFamily: 'monospace' }, ...{ color: textColor } }}>{prices[1]} USD</h3>
                    {!parseFloat(prices[1]) ? "Cargando..." : fecha}
                </div>
            </div>
        </div >
    );
}

export default Price;
