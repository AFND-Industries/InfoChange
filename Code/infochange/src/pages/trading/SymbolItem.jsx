import React from "react";

function SymbolItem({ pair, regex, tokenInfo, setCoinName }) {
    let reg = regex.toUpperCase();
    let baseAsset = pair.baseAsset.replace(reg, "");

    const logoUrl = tokenInfo == null ? "" : tokenInfo.logo;
    const faviconUrl = './favicon.ico';

    if (reg.length > pair.baseAsset.length) {
        reg = "";
        baseAsset = pair.baseAsset;
    }

    const clickHandler = () => setCoinName(pair.symbol);

    return (
        <li className="list-group-item" key={pair.symbol} onClick={clickHandler}>
            <img src={logoUrl} className="img-fluid me-2 img-thumbnail"
                style={{ width: '50px', height: '50px' }} onError={(e) => { e.target.src = faviconUrl; }} alt="Logo" />
            <span className="text-dark h5 m-0">
                <span style={{ backgroundColor: "#fff3cd" }}>{reg}</span>{baseAsset}
            </span>
            <span className="text-muted h6 m-0 me-5">/{pair.quoteAsset}</span>
            <span className="ms-auto text-end">
                {pair.price}
            </span>
        </li>
    )
}

export default SymbolItem;