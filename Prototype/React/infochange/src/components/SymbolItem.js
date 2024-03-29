import React from "react";

// Esta clase se renderiza muchas veces (por el setState del precio), como podemos solucionarlo?
function SymbolItem({ pair, regex }) {
    let reg = regex.toUpperCase();
    let baseAsset = pair.baseAsset.replace(reg, "");

    if (reg.length > pair.baseAsset.length) {
        reg = "";
        baseAsset = pair.baseAsset;
        console.log("ola");
    }

    return (
        <li key={pair.symbol}>
            <a className="dropdown-item" href={`./${pair.symbol}`}>
                <span className="text-dark h5">
                    <span style={{ backgroundColor: "#fff3cd" }}>{reg}</span>{baseAsset}
                </span>
                <span className="text-muted h6">/{pair.quoteAsset}</span>
            </a>
        </li>
    )
}

export default SymbolItem;