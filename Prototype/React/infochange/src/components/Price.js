import React from "react";
import { useBitcoin } from "../context/BitcoinContext";

function Price() {
    const { getBitcoinPrice } = useBitcoin();
    document.title = "BTCUSD " + getBitcoinPrice();

    return (
        <div id="container">
            {document.title}
        </div>
    );
}

export default Price;