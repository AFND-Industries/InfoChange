import React from "react";

function SymbolItem({ pair, regex, tokenInfo, clickHandler }) {
    let reg = regex.toUpperCase();
    let baseAsset = pair.baseAsset.replace(reg, "");

    const logoUrl = tokenInfo == null ? "" : tokenInfo.logo;
    const faviconUrl = '/favicon.ico';

    if (reg.length > pair.baseAsset.length) {
        reg = "";
        baseAsset = pair.baseAsset;
    }

    return (
        <li className="list-group-item align-items-center d-flex" key={pair.symbol} onClick={clickHandler}>
            <img src={logoUrl} className="me-2"
                style={{ width: '25px', height: '25px' }} onError={(e) => { e.target.src = faviconUrl; }} alt="Logo" />
            <span className="text-dark h5 m-0">
                <span style={{ backgroundColor: "#fff3cd" }}>{reg}</span>{baseAsset}
            </span>
            <span className="text-muted h6 me-5 mb-0">/{pair.quoteAsset}</span>
            <span className="ms-auto text-end">
                {pair.price}
            </span>
        </li>
    )
}

export default SymbolItem;