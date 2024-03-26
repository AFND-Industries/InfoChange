import React, { useEffect } from "react";

function Price({ asset, price }) {
    useEffect(() => {
        document.title = "BTCUSD " + price;
    })

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
            <h2 className="text-center mb-2">Precio de {asset}</h2>
            <div className="card mx-auto" style={{ maxWidth: "400px" }}>
                <div className="card-body text-center">
                    <h3 className="card-title m-0" style={{ fontFamily: 'monospace' }}>{price} USD</h3>
                    {!parseFloat(price) ? "Cargando..." : fecha}
                </div>
            </div>
        </div >
    );
}

export default Price;
