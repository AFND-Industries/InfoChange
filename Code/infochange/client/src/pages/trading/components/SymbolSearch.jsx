import React, { useState } from "react";
import { useTrading } from "../context/TradingContext";
import { useAPI } from "../../../context/APIContext";
import SymbolList from "./SymbolList";
import "./SymbolSearch.css";

const topPairs = [
    "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT",
    "DOGEUSDT", "ADAUSDT", "SHIBUSDT", "AVAXUSDT", "TRXUSDT"
];

function SymbolSearch({ style = 0 }) {
    const { filterPairs } = useAPI();
    const { setActualPair, getActualPair } = useTrading();
    const [searchInput, setSearchInput] = useState("");
    const [searchPairs, setSearchPairs] = useState([]);

    const searchHandler = () => {
        console.log(searchInput);
    }

    const handleInputChange = (event) => {
        if (event.target.value.length === 0) setSearchPairs([]);
        else setSearchPairs(filterPairs(event.target.value, style === 0 ? "USDT" : ""));

        setSearchInput(event.target.value);
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') searchHandler();
    }

    return (
        <>
            <div className="row mt-lg-0 mt-2">
                <input
                    className="form-control border border-4 rounded"
                    type="search"
                    placeholder="Buscar par..."
                    style={{ backgroundColor: "#ffffff", color: "#000000" }}
                    value={searchInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    tabIndex={1}
                />
            </div>
            <div
                className="row border border-4 overflow-y-scroll mt-2 custom-scrollbar rounded"
                style={{ height: "50vh", overflowX: "hidden" }}
            >
                <div className="d-flex flex-column ps-0 pe-0">
                    <ul className="list-group list-group-flush">
                        <SymbolList
                            style={style}
                            pairs={searchInput.length === 0 ? topPairs : searchPairs}
                            regex={searchInput}
                            onClick={(newPair) => {
                                const actualSymbol = getActualPair();
                                if (actualSymbol === undefined || newPair.symbol !== actualSymbol.symbol) {
                                    setActualPair(newPair);
                                    setSearchInput("");
                                    setSearchPairs([]);
                                }
                            }}
                        />
                    </ul>
                </div>
            </div>
        </>
    );
}

export default SymbolSearch;
