import { formatPrice } from "../../../lib/format";
import { handleLogoError, logoUrl } from "./assetLogo";
import "./SymbolItem.css";

function SymbolItem({ mode = 0, pair, query = "", token, price, active, onSelect }) {
    // Se resalta lo tecleado solo cuando encaja con el principio del ticker.
    // Antes se buscaba en cualquier posicion y se recomponia el nombre con el
    // trozo resaltado por delante, asi que buscar "BIT" pintaba "BITBTC".
    const needle = query.toUpperCase();
    const highlight = needle.length > 0 && pair.baseAsset.startsWith(needle) ? needle : "";
    const rest = pair.baseAsset.slice(highlight.length);

    const renderNameNewbie = <span className="text-dark h5 m-0">{pair.baseAssetName}</span>
    const renderNamePro = (
        <>
            <span className="text-dark h5 m-0">
                <span style={{ backgroundColor: "#fff3cd" }}>{highlight}</span>{rest}
            </span>
            <span className="text-muted h6 me-5 mb-0">/{pair.quoteAsset}</span>
        </>
    );

    return (
        <li
            aria-label={pair.baseAssetName}
            className="clickable-item list-group-item align-items-center d-flex"
            onClick={onSelect}
            onKeyDown={(event) => {
                if (event.key === "Enter") onSelect();
            }}
            style={active ? { backgroundColor: "#fff3cd" } : {}}
            tabIndex={0}
        >
            <img
                src={logoUrl(token)}
                className="me-2"
                style={{ width: '25px', height: '25px' }}
                onError={handleLogoError}
                alt={"Logo de " + pair.baseAssetName}
            />
            <span>
                {mode === 0 ? renderNameNewbie : renderNamePro}
            </span>
            <span className="ms-auto text-end">
                {price === undefined ? "-" : formatPrice(price, pair.decimalPlaces)}
                {mode === 0 ? "$" : ""}
            </span>
        </li>
    );
}

export default SymbolItem;
