import { useMemo, useState } from "react";

import { useSymbols } from "../../../hooks/useMarket";
import { useTrading } from "../context/TradingContext";
import SymbolList from "./SymbolList";
import "./SymbolSearch.css";

const topPairs = [
    "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT",
    "DOGEUSDT", "ADAUSDT", "SHIBUSDT", "AVAXUSDT", "TRXUSDT"
];

/**
 * Mismo criterio que el antiguo `filterPairs`: coincide el principio del nombre
 * del activo o el del simbolo, y en modo novato solo se ofrecen pares contra
 * USDT. Ahora se filtra en local sobre el catalogo de `useSymbols`.
 */
function matches(pair, needle, quotePrefix) {
    return (
        pair.quoteAsset.startsWith(quotePrefix) &&
        (pair.baseAssetName.toUpperCase().startsWith(needle) ||
            pair.symbol.startsWith(needle))
    );
}

function SymbolSearch() {
    const { mode, pair: currentPair, selectPair } = useTrading();
    const { data: symbols, isPending } = useSymbols();
    const [searchInput, setSearchInput] = useState("");

    const query = searchInput.trim();

    const pairs = useMemo(() => {
        const catalog = symbols ?? [];

        if (query.length === 0) {
            return topPairs
                .map((symbol) => catalog.find((pair) => pair.symbol === symbol))
                .filter((pair) => pair !== undefined);
        }

        const quotePrefix = mode === 0 ? "USDT" : "";
        return catalog.filter((pair) => matches(pair, query.toUpperCase(), quotePrefix));
    }, [symbols, query, mode]);

    return (
        <>
            <div className="row mt-lg-0 mt-2">
                <label htmlFor="searchPair" className="visually-hidden">Buscar par</label>
                <input
                    className="form-control border border-4 rounded"
                    type="search"
                    placeholder="Buscar par..."
                    id="searchPair"
                    autoComplete="off"
                    style={{ backgroundColor: "#ffffff", color: "#000000" }}
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    tabIndex={0}
                />
            </div>
            <div
                className="row border border-4 overflow-y-scroll mt-2 custom-scrollbar rounded"
                style={{ height: "50vh", overflowX: "hidden" }}
            >
                <div className="d-flex flex-column ps-0 pe-0">
                    <ul className="list-group list-group-flush">
                        <SymbolList
                            mode={mode}
                            pairs={pairs}
                            query={query}
                            activeSymbol={currentPair?.symbol}
                            loading={isPending}
                            onSelect={(pair) => {
                                selectPair(pair);
                                setSearchInput("");
                            }}
                        />
                    </ul>
                </div>
            </div>
        </>
    );
}

export default SymbolSearch;
