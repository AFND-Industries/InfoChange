import React from "react";
import { useAPI } from "../../../../../context/APIContext";

const TradeItem = ({ trade }) => {
    const { getTokenInfo, getPair } = useAPI();
    console.log(trade);
    const transactionDate = new Date(trade.date);

    const hours = ('0' + transactionDate.getHours()).slice(-2);
    const minutes = ('0' + transactionDate.getMinutes()).slice(-2);
    const day = ('0' + transactionDate.getDate()).slice(-2);
    const month = ('0' + (transactionDate.getMonth() + 1)).slice(-2);
    const year = transactionDate.getFullYear();

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    const symbol = getPair(trade.symbol);
    const base = getTokenInfo(symbol.baseAsset);
    const quote = getTokenInfo(symbol.quoteAsset);

    const drawCoin = (coin, symbol) => (
        <div>
            <img style={{ width: "35px", height: "35px" }} src={coin.logo} alt={"Logo de " + symbol} />
        </div>
    );

    const drawTransaction = (base, quote, symbol) => {
        const coin1 = trade.type === "BUY" ? quote : base;
        const coin2 = trade.type === "BUY" ? base : quote;

        return (
            <div className="d-flex justify-content-start align-items-center">
                {drawCoin(coin1, trade.type === "BUY" ? symbol.quoteAsset : symbol.baseAsset)}
                <i className="bi bi-arrow-right text-dark mx-2" style={{ fontSize: '1em' }}></i>
                {drawCoin(coin2, trade.type === "BUY" ? symbol.baseAsset : symbol.quoteAsset)}
            </div>
        );
    }

    const baseAssetName = " " + symbol.baseAssetName;
    const quoteAssetName = symbol.quoteAsset === "USDT" ? "$" : " " + symbol.quoteAssetName;

    const textBuy = (
        <>
            Has <span className="fw-bold">comprado {trade.amount_received}{baseAssetName}</span> por <span className="fw-bold">{trade.paid_amount}{quoteAssetName}</span>
        </>
    )

    const textSell = (
        <>
            Has <span className="fw-bold">vendido {trade.paid_amount}{baseAssetName}</span> por <span className="fw-bold">{trade.amount_received}{quoteAssetName}</span>
        </>
    )

    return (
        <li key={trade.id} className="list-group-item px-0">
            <div className="row align-items-center">
                <div className="d-flex col-lg-9 d-flex align-items-start mb-3 mb-lg-0 flex-column">
                    <div className="d-flex align-items-center">
                        {drawTransaction(base, quote, symbol)}
                    </div>
                    <div>
                        {trade.type === "BUY" ? textBuy : textSell}
                    </div>
                    <div className="d-flex flex-row text-secondary flex-lg-row flex-column" style={{ fontSize: "0.9em" }}>
                        <span>Precio: {trade.price}{quoteAssetName}&nbsp;&nbsp;</span>
                        <span>Comisión: {trade.comission.toFixed(8)}{trade.type === "BUY" ? quoteAssetName : baseAssetName}</span>
                    </div>
                </div>
                <div className="col-lg-3 d-flex flex-column align-items-center align-items-lg-end">
                    <span className={`fw-bold me-1 ${trade.type === "BUY" ? "text-success" : "text-danger"}`}>
                        {trade.type === "BUY" ? "COMPRA" : "VENTA"}</span>
                    <span className="text-secondary text-end" style={{ fontSize: "0.9em" }}>{formattedDate}</span>
                </div>
            </div>
        </li>
    );
};

export default TradeItem;
