import React from "react";
import TradeItem from "./TradeItem";

const TradeHistory = ({ tradeHistory, showItems }) => {
    let renderTradeHistory = null;

    if (tradeHistory) {
        const sortedHistory = tradeHistory.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        ).slice(0, showItems);

        renderTradeHistory = sortedHistory.map((trade, index) => {
            return <TradeItem key={index} trade={trade} />;
        });
    }

    return (
        <ul className="list-group list-group-flush p-0 m-0">
            {renderTradeHistory.length === 0 ? (
                <li className="list-group-item text-center">
                    <b className="fs-5">No se han encontrado resultados :(</b>
                </li>
            ) : (
                renderTradeHistory
            )}
        </ul>
    );
};

export default TradeHistory;
