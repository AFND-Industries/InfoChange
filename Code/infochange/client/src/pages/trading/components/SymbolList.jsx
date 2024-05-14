import React from "react";

import { useTrading } from "../context/TradingContext";
import SymbolItem from "./SymbolItem";
import { useAPI } from "../../../context/APIContext";

function SymbolList({ style = 0, pairs, regex = "", onClick }) {
    const { getPair, getTokenInfo } = useAPI();
    const { getActualPair } = useTrading();

    const renderNoMatches = (
        <div className="d-flex justify-content-start align-items-center mt-2">
            <span className="alert alert-secondary mx-3">No se han encontrado coincidencias para tu búsqueda</span>
        </div>
    );

    const renderPairs = pairs.map(pair => {
        const { symbol } = pair;
        const actualPair = symbol === undefined ? getPair(pair) : pair;
        const active = getActualPair() != null && actualPair.symbol === getActualPair().symbol;
        const clickHandler = () => onClick(actualPair);

        return (
            <SymbolItem
                style={style}
                key={actualPair.symbol}
                tokenInfo={getTokenInfo(actualPair.baseAsset)}
                pair={actualPair}
                regex={regex}
                clickHandler={clickHandler}
                active={active}
            />
        );
    });

    const renderContent = pairs.length > 0 ? renderPairs : renderNoMatches;

    return <>{renderContent}</>;
}

export default SymbolList;
