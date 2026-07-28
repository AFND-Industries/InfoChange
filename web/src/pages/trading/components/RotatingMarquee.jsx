import { useMemo } from "react";

import { usePrices, useSymbols, useTokenLookup } from "../../../hooks/useMarket";
import { formatPrice } from "../../../lib/format";
import { handleLogoError, logoUrl } from "./assetLogo";
import "./RotatingMarquee.css";

const defaultPairs = [
    "BTCUSDT",
    "ETHUSDT",
    "LTCUSDT",
    "LINKUSDT",
    "DOTUSDT",
    "VITEUSDT"]

// El valor por omision es la propia constante y no un `[]` nuevo en cada
// render, para que `wanted` conserve su identidad y el `useMemo` de abajo
// sirva de algo.
function RotatingMarquee({ display = true, pairs = defaultPairs, floatingBottom = false }) {
    const { data: symbols } = useSymbols();
    const { data: prices } = usePrices();
    const tokenOf = useTokenLookup();

    const wanted = pairs.length == 0 ? defaultPairs : pairs;

    const priceOf = useMemo(() => {
        const index = new Map();
        for (const entry of prices ?? []) index.set(entry.symbol, entry.price);
        return index;
    }, [prices]);

    // Un par retirado del mercado ya no rompe la marquesina: antes se pedia el
    // logo de `pair.baseAsset` sin comprobar que el par siguiese existiendo.
    const marqueePairs = useMemo(
        () =>
            wanted
                .map((symbol) => (symbols ?? []).find((pair) => pair.symbol === symbol))
                .filter((pair) => pair !== undefined),
        [symbols, wanted],
    );

    const marquee = marqueePairs.map((pair, i) => {
        const tokenInfo = tokenOf(pair.baseAsset);
        const price = priceOf.get(pair.symbol);

        const index = 2 * i + 1;
        const nonenize = index == 3 || index == 7 || index == 11;

        return (
            <div key={pair.symbol}
                style={{ backgroundColor: "#4E545A" }}
                className={`d-flex align-items-center justify-content-center col-2 rotating-marquee-element rme-${index} ${nonenize ? "hidden-md" : ""}`}>
                <div className="d-flex flex-row align-items-center">
                    <img src={logoUrl(tokenInfo)} className="me-2"
                        style={{ width: '15px', height: '15px' }} onError={handleLogoError}
                        alt={"Logo de " + (tokenInfo?.name ?? pair.baseAsset)} />
                    <div className="text-white marquee-pair"><b>{pair.symbol}</b></div>
                </div>
                <div className="text-warning">
                    <b>{price === undefined ? "-" : formatPrice(price, pair.decimalPlaces)}</b>
                </div>
            </div >
        );
    })

    return (
        <div className={(floatingBottom ? "floating-bottom " : "") + "rotating-marquee"}
            style={{ display: (display ? "block" : "none"), backgroundColor: "#4E545A" }}>
            {marquee}
        </div >
    );
}

export default RotatingMarquee;
