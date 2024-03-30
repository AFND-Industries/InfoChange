import React, { useEffect, useState, useRef } from "react";
import { useAsset } from "../contexts/AssetContext";

function AssetPrice() {
    const { getPair, getBitcoinPrice, getActualSymbol, getTokenInfo } = useAsset();
    const actualSymbol = useRef(null);
    const price = getBitcoinPrice();

    const [baseAssetInfo, setBaseAssetInfo] = useState(null);

    useEffect(() => {
        document.title = getPair().toUpperCase() + ": " + (price < 0 ? "-" : price);
    }, [getBitcoinPrice, getPair, price])

    useEffect(() => {
        const aSymbol = getActualSymbol();
        if (aSymbol.symbol != null) {
            const tokenInfo = getTokenInfo(aSymbol.baseAsset);

            if (tokenInfo != null) {
                let link = document.querySelector("link[rel~='icon']");
                if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.getElementsByTagName('head')[0].appendChild(link);
                }
                link.href = tokenInfo.logo;
            }

            actualSymbol.current = aSymbol;
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

    const baseAssetInfoObject =
        <div className="container">
            <div className="row">
                <div className="col d-flex align-items-center justify-content-center m-2">
                    <img
                        src={baseAssetInfo != null ? baseAssetInfo.logo : process.env.PUBLIC_URL + '/favicon.ico'}
                        style={{ width: '75px', height: '75px' }}
                        className="img-fluid me-3"
                        alt="Imagen" />
                    <h2 className="text-center mb-0">{baseAssetInfo != null ? baseAssetInfo.name :
                        (actualSymbol.current != null ? actualSymbol.current.baseAsset : "")}</h2>
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
