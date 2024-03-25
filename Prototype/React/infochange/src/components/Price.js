import React, { useEffect, useState } from "react";

function Price() {

    const [price, setPrice] = useState(null);

    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");
    ws.onmessage = (event) => {
        const stockObject = JSON.parse(event.data);
        const actualPrice = parseFloat(stockObject.p);
        setPrice(actualPrice);
    };

    useEffect(() => {
        document.title = "BTCUSD " + price;
    }, [price])

    return (
        <div id="price">
            <span>BTCUSD {price == null ? "-" : price.toFixed(2)}</span>
        </div>
    )
}

export default Price;