import React, { useEffect, useState } from "react";
import { useAsset } from "../contexts/AssetContext";

function AssetPrice() {
    const { getPair, getBitcoinPrice, getActualSymbol, getTokenInfo } = useAsset();
    const price = getBitcoinPrice();

    const [baseAssetInfo, setBaseAssetInfo] = useState(null);

    useEffect(() => {
        document.title = getPair().toUpperCase() + ": " + (price < 0 ? "-" : price);
    }, [getBitcoinPrice, getPair, price])

    useEffect(() => {
        const actualSymbol = getActualSymbol();
        if (actualSymbol.symbol != null) {
            const tokenInfo = getTokenInfo(actualSymbol.baseAsset);

            if (tokenInfo != null) {
                let link = document.querySelector("link[rel~='icon']");
                if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.getElementsByTagName('head')[0].appendChild(link);
                }
                link.href = tokenInfo.logo;
            }

            setBaseAssetInfo(tokenInfo);
        }
    }, [getActualSymbol()])

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

    const baseAssetInfoObject = baseAssetInfo != null &&
        <div className="container">
            <div className="row">
                <div className="col d-flex align-items-center justify-content-center m-2">
                    <img src={baseAssetInfo.logo != null && baseAssetInfo.logo} alt="Imagen" className="me-3" />
                    <h2 className="text-center mb-0">{baseAssetInfo.name}</h2>
                </div>
            </div>
        </div>;


    return (
        <div className="price m-5">

            {baseAssetInfoObject}
            <div className="card mx-auto" style={{ maxWidth: "400px" }}>
                <div className="card-body text-center">
                    <h3 className="card-title m-0" style={{ fontFamily: 'monospace' }}>{price < 0 ? "InfoChange" : getPair().toUpperCase() + ": " + price}</h3>
                    {parseFloat(getBitcoinPrice()) < 0 ? "Cargando..." : fecha}
                </div>
            </div>
        </div >
    );
}

export default AssetPrice;
