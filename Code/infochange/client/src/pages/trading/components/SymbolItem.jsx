import React from "react";
import "./SymbolItem.css";

function SymbolItem({ style = 0, pair, regex, tokenInfo, clickHandler, active }) {
    let reg = regex.toUpperCase();
    let baseAsset = pair.baseAsset.replace(reg, "");

    const logoUrl = tokenInfo == null ? "" : tokenInfo.logo;
    const faviconUrl = '/favicon.ico';

    if (reg.length > pair.baseAsset.length) {
        reg = "";
        baseAsset = pair.baseAsset;
    }

    const renderNameNewbie = <span className="text-dark h5 m-0">{pair.baseAssetName}</span>
    const renderNamePro = (
        <>
            <span className="text-dark h5 m-0">
                <span style={{ backgroundColor: "#fff3cd" }}>{reg}</span>{baseAsset}
            </span>
            <span className="text-muted h6 me-5 mb-0">/{pair.quoteAsset}</span>
        </>
    );

    return (
        <li className="clickable-item list-group-item align-items-center d-flex" key={pair.symbol} onClick={clickHandler}
            style={active ? { backgroundColor: "#fff3cd" } : {}}>
            <img src={logoUrl} className="me-2"
                style={{ width: '25px', height: '25px' }} onError={(e) => { e.target.src = faviconUrl; }} alt="Logo" />
            {style == 0 ? renderNameNewbie : renderNamePro}
            <span className="ms-auto text-end">
                {pair.price}{style == 0 ? "$" : ""}
            </span>
        </li>
    )
}

export default SymbolItem;