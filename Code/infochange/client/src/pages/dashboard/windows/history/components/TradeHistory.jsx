import React from "react";
import TradeItem from "./TradeItem";
import { useAPI } from "../../../../../context/APIContext";

const TradeHistory = ({ tradeHistory }) => {
    let renderTradeHistory = null;

    if (tradeHistory) {
        const sortedHistory = tradeHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

        renderTradeHistory = sortedHistory.map((trade, index) => {
            return <TradeItem trade={trade} />;
        });
    }

    return (
        <ul className="list-group list-group-flush p-0 m-0">
            {renderTradeHistory}
        </ul>
    );
};

export default TradeHistory;
