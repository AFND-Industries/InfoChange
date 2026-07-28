import { useMemo } from "react";
import Spinner from "react-bootstrap/Spinner";

import { usePrices, useTokenLookup } from "../../../hooks/useMarket";
import SymbolItem from "./SymbolItem";

function SymbolList({ mode = 0, pairs, query = "", activeSymbol, loading = false, onSelect }) {
    const { data: prices } = usePrices();
    const tokenOf = useTokenLookup();

    const priceOf = useMemo(() => {
        const index = new Map();
        for (const entry of prices ?? []) index.set(entry.symbol, entry.price);
        return index;
    }, [prices]);

    const renderLoading = (
        <div className="d-flex justify-content-center align-items-center mt-3">
            <Spinner animation="border" role="status" variant="primary" />
            <span className="visually-hidden">Cargando pares</span>
        </div>
    );

    const renderNoMatches = (
        <div className="d-flex justify-content-start align-items-center mt-2">
            <span className="alert alert-secondary mx-3">
                No se han encontrado coincidencias para tu búsqueda
            </span>
        </div>
    );

    const renderPairs = pairs.map((pair) => (
        <SymbolItem
            key={pair.symbol}
            mode={mode}
            pair={pair}
            query={query}
            token={tokenOf(pair.baseAsset)}
            price={priceOf.get(pair.symbol)}
            active={pair.symbol === activeSymbol}
            onSelect={() => onSelect(pair)}
        />
    ));

    // Mientras llega el catalogo no se puede afirmar que no haya coincidencias.
    const renderContent = loading
        ? renderLoading
        : pairs.length > 0
            ? renderPairs
            : renderNoMatches;

    return <>{renderContent}</>;
}

export default SymbolList;
