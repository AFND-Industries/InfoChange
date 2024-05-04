import React, { useState } from "react";

import { useTrading } from "../context/TradingContext";
import SymbolList from "./SymbolList";

const topPairs = [
    "BTCUSDT",
    "ETHUSDT",
    "BNBUSDT",
    "SOLUSDT",
    "XRPUSDT",
    "DOGEUSDT",
    "ADAUSDT",
    "SHIBUSDT",
    "AVAXUSDT",
    "TRXUSDT"
]

// meter a parte de TOP (que es como lo que esta puesto, que son los marqueePairs pero mejor poner el top 10) un favoritos

function SymbolSearch({ style = 0 }) {
    const { filterPairs, setActualPair, getActualPair } = useTrading();
    const [searchInput, setSearchInput] = useState("");
    const [searchPairs, setSearchPairs] = useState([]);

    const searchHandler = () => {
        console.log(searchInput);
    }

    const handleInputChange = (event) => {
        if (event.target.value.length === 0) setSearchPairs([]);
        else setSearchPairs(filterPairs(event.target.value, style == 0 ? "USDT" : ""));

        setSearchInput(event.target.value);
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') searchHandler();
    }

    return (
        <>
            <div className="row">
                <input
                    className="form-control border border-4 rounded"
                    type="search"
                    placeholder="Buscar par..."
                    style={{ backgroundColor: "#ffffff", color: "#000000" }}
                    value={searchInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
            </div>
            <div className="row border overflow-y-scroll mt-2 border border-4 rounded" style={{ height: "64vh", overflowX: "hidden" }}>
                <div className="d-flex flex-column ps-0 pe-0">
                    <ul className="list-group list-group-flush">
                        <SymbolList
                            style={style}
                            pairs={searchInput.length == 0 ? topPairs : searchPairs}
                            regex={searchInput}
                            onClick={(newPair) => {
                                const actualSymbol = getActualPair();

                                if (actualSymbol === undefined || newPair.symbol !== actualSymbol.symbol) {
                                    setActualPair(newPair);
                                    setSearchInput("");
                                    setSearchPairs([]);
                                }
                            }} />
                    </ul>
                </div>
            </div>
        </>
    );
}

export default SymbolSearch;