import React, { useState } from "react";
import TradeHistory from "./components/TradeHistory";
import BizumHistory from "./components/BizumHistory";

export default function History({ user, tradeHistory, bizumHistory, bizumUsers }) {
    const [historyMode, setHistoryMode] = useState(0);

    const handleModeChange = () => {
        setHistoryMode((mode) => (mode + 1) % 2);
    };

    const HistoryComponent = historyMode === 0 ? TradeHistory : BizumHistory;

    return (
        <>
            <div className="row px-5 pt-4">
                <div className="col d-flex justify-content-between align-items-center flex-md-row flex-column">
                    <h2 className="text-center mb-0">Historial de {historyMode === 0 ? "Trades" : "Bizums"}</h2>
                    <button className="btn btn-primary mt-md-0 mt-2" onClick={handleModeChange}>
                        {historyMode == 0 ? "Ir a historial de bizums" : "Ir a historial de trades"}
                    </button>
                </div>
            </div>
            <div className="row px-5 py-4">
                <div className="col">
                    <HistoryComponent tradeHistory={tradeHistory} bizumHistory={bizumHistory} bizumUsers={bizumUsers} user={user} />
                </div>
            </div>
        </>
    );
}
