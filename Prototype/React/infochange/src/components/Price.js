import React, { useEffect } from "react";
import { useBitcoin } from "../contexts/BitcoinContext";

function Price() {
    const { getPair, getBitcoinPrice } = useBitcoin();
    const price = getBitcoinPrice();

    useEffect(() => {
        document.title = getPair().toUpperCase() + ": " + price;
    }, [getBitcoinPrice, getPair, price])

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
            <div className="card mx-auto" style={{ maxWidth: "400px" }}>
                <div className="card-body text-center">
                    <h3 className="card-title m-0" style={{ fontFamily: 'monospace' }}>{price < 0 ? "InfoChange" : getPair().toUpperCase() + ": " + price}</h3>
                    {parseFloat(getBitcoinPrice()) < 0 ? "Cargando..." : fecha}
                </div>
            </div>
        </div >
    );
}

export default Price;
