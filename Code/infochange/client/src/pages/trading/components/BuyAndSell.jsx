import React, { useState, useEffect } from "react";

import { useTrading } from "../context/TradingContext";
import { useAuth } from "../../authenticator/AuthContext";

// poner lo de las comas y punto
// meter aqui trading mode y quitar lo de style por argumento
function BuyAndSell({ style = 0 }) {
    const { getActualPair, getActualPairPrice } = useTrading();
    const { getActualUserWallet } = useAuth();

    const actualUserWallet = getActualUserWallet();
    const getWalletAmount = (symbol) => {
        let balance = 0;

        if (actualUserWallet !== null) {
            const search = Object.values(actualUserWallet).filter(w => w.coin === symbol);
            if (search.length > 0)
                balance = search[0].quantity;
        }
        return balance;
    }
    const tradingComision = 0.00065;

    const getBaseAsset = () => getActualPair()?.baseAsset || "";
    const showBaseAsset = style === 0 ? getActualPair().baseAssetName : getActualPair().baseAsset;

    const getQuoteAsset = () => getActualPair()?.quoteAsset || "";
    const showQuoteAsset = style === 0 ? "$" : " " + getActualPair().quoteAsset;
    const showQuoteDecimals = style === 0 ? 2 : 8;

    const [buyQuoteAssetInput, setBuyQuoteAssetInput] = useState("");
    const [buyBaseAssetInput, setBuyBaseAssetInput] = useState("");
    const [sellBaseAssetInput, setSellBaseAssetInput] = useState("");
    const [sellQuoteAssetInput, setSellQuoteAssetInput] = useState("");

    const [buyRangeValue, setBuyRangeValue] = useState(0);
    const [sellRangeValue, setSellRangeValue] = useState(0);


    const updateInputValues = (value, setValueFunc, oppositeSetValueFunc, action, assetChanged) => {
        const newValue = parseFloat(value);

        if (!isNaN(newValue) && newValue > 0) {
            setValueFunc(newValue);
            const oppositeValue = assetChanged === "BASE" ? newValue * getActualPairPrice() : newValue / getActualPairPrice();
            oppositeSetValueFunc(oppositeValue.toFixed(8));

            const amountDisp = getWalletAmount(action === "BUY" ? getQuoteAsset() : getBaseAsset());

            let rangeValue;
            if (amountDisp > 0) {
                if (action === "BUY" && assetChanged === "QUOTE") rangeValue = 100 * newValue / amountDisp;
                else if (action === "BUY" && assetChanged === "BASE") rangeValue = 100 * newValue * getActualPairPrice() / amountDisp;
                else if (action === "SELL" && assetChanged === "BASE") rangeValue = 100 * newValue / amountDisp;
                else if (action === "SELL" && assetChanged === "QUOTE") rangeValue = 100 * (newValue / getActualPairPrice()) / amountDisp;

                rangeValue = Math.round(100 * rangeValue) / 100;
            } else {
                rangeValue = 1000;
            }

            if (action === "BUY") setBuyRangeValue(rangeValue);
            else setSellRangeValue(rangeValue);
        } else {
            setValueFunc("");
            oppositeSetValueFunc("");

            if (action === "BUY") setBuyRangeValue(0);
            else setSellRangeValue(0);
        }
    };

    const handleBuyQuoteAsset = (event) => updateInputValues(event.target.value, setBuyQuoteAssetInput, setBuyBaseAssetInput, "BUY", "QUOTE");
    const handleBuyBaseAsset = (event) => updateInputValues(event.target.value, setBuyBaseAssetInput, setBuyQuoteAssetInput, "BUY", "BASE");
    const handleSellBaseAsset = (event) => updateInputValues(event.target.value, setSellBaseAssetInput, setSellQuoteAssetInput, "SELL", "BASE");
    const handleSellQuoteAsset = (event) => updateInputValues(event.target.value, setSellQuoteAssetInput, setSellBaseAssetInput, "SELL", "QUOTE");

    const handleRangeChange = (event, setValueFunc, asset, action) => {
        const rangeValue = parseInt(event.target.value);
        const newValue = (rangeValue / 100) * getWalletAmount(asset);

        setValueFunc(rangeValue);

        if (action === "BUY") updateInputValues(newValue.toFixed(8), setBuyQuoteAssetInput, setBuyBaseAssetInput, "BUY", "QUOTE");
        else updateInputValues(newValue.toFixed(8), setSellBaseAssetInput, setSellQuoteAssetInput, "SELL", "BASE")
    };

    const clearAmountInputs = () => {
        setBuyRangeValue(0);
        setSellRangeValue(0);
        updateInputValues("", setSellBaseAssetInput, setSellQuoteAssetInput);
        updateInputValues("", setBuyQuoteAssetInput, setBuyBaseAssetInput);
    };

    useEffect(() => {
        clearAmountInputs();
    }, [getActualPair(), actualUserWallet]);

    const showModal = (title, message) => {
        const modal = new bootstrap.Modal(document.getElementById('just-close-modal'));
        const modalTitle = document.getElementById('just-close-modal-title');
        const modalBody = document.getElementById('just-close-modal-body');

        modalTitle.innerHTML = title;
        modalBody.innerHTML = message;

        modal.show();
    };

    const performTransaction = (paidAmount, action) => {
        const baseAsset = getBaseAsset();
        const quoteAsset = getQuoteAsset();

        const comission = paidAmount * tradingComision;
        const receivedAmount = (paidAmount - comission) * (action === "BUY" ? 1 / getActualPairPrice() : getActualPairPrice());
        const symbol = action === "BUY" ? quoteAsset : baseAsset;

        if (getActualPairPrice() <= 0 || isNaN(receivedAmount) || isNaN(paidAmount)) {
            showModal("Error", "El monto de la transacción introducido no es válido");
            return;
        }

        if (getWalletAmount(symbol) < paidAmount) {
            showModal("Error", `No tienes suficientes ${action === "BUY" ? showQuoteAsset : showBaseAsset} `);
            return;
        }

        const updatedWallet = { ...actualUserWallet };

        const newBaseAssetAmount = getWalletAmount(baseAsset) + (action === "BUY" ? receivedAmount : -paidAmount);
        updatedWallet[baseAsset] = parseFloat(newBaseAssetAmount.toFixed(8));

        const newQuoteAssetAmount = getWalletAmount(quoteAsset) + (action === "BUY" ? -paidAmount : receivedAmount);
        updatedWallet[quoteAsset] = parseFloat(newQuoteAssetAmount.toFixed(8));

        // hacer un post
        //setMyWallet(updatedWallet);

        if (action === "BUY") {
            showModal(`Compra realizada con éxito`,
                `Has comprado <b> ${receivedAmount.toFixed(8)} ${showBaseAsset}</b> por <b> ${paidAmount.toFixed(showQuoteDecimals)}${showQuoteAsset}
                </b> y has pagado <b> ${comission.toFixed(showQuoteDecimals)}${showQuoteAsset}</b> de comisión.`);
        } else {
            showModal(`Venta realizada con éxito`,
                `Has vendido <b> ${paidAmount.toFixed(8)} ${showBaseAsset}</b> por <b> ${receivedAmount.toFixed(showQuoteDecimals)}${showQuoteAsset}
                </b> y has pagado <b> ${comission.toFixed(8)} ${showBaseAsset}</b> de comisión.`);
        }
    };

    const onBuy = () => {
        const paidAmount = parseFloat(buyQuoteAssetInput);
        performTransaction(paidAmount, "BUY");
    };

    const onSell = () => {
        const paidAmount = parseFloat(sellBaseAssetInput);
        performTransaction(paidAmount, "SELL");
    };

    return (
        <>
            <div className="col-md border border-4 rounded me-1">
                <div className="mt-1 mb-1">
                    Disponible: {getWalletAmount(getQuoteAsset()).toFixed(showQuoteDecimals)}{showQuoteAsset}
                </div>
                <div className="input-group input-group-sm">
                    <input type="text" className="form-control" placeholder="Cantidad a comprar" value={buyQuoteAssetInput} onChange={handleBuyQuoteAsset} />
                    <span className="input-group-text" id="inputGroup-sizing-sm">{showQuoteAsset}</span>
                </div>
                <input type="range" className="form-range" value={buyRangeValue} onChange={(event) => handleRangeChange(event, setBuyRangeValue, getQuoteAsset(), "BUY")} />
                <div className="input-group input-group-sm">
                    <input type="text" className="form-control" placeholder="Total (sin comisiones)" value={buyBaseAssetInput} onChange={handleBuyBaseAsset} />
                    <span className="input-group-text" id="inputGroup-sizing-sm">{showBaseAsset}</span>
                </div>
                <div className="mt-1 mb-1">
                    Comisión estimada: {(buyQuoteAssetInput * tradingComision).toFixed(8)}{showQuoteAsset}
                </div>
                <button className="btn btn-success w-100 mb-2" onClick={onBuy}>Comprar {showBaseAsset}</button>
            </div>
            <div className="col-md border border-4 rounded ms-2">
                <div className="mt-1 mb-1">
                    Disponible: {getWalletAmount(getBaseAsset()).toFixed(8)} {showBaseAsset}
                </div>
                <div>
                    <div className="input-group input-group-sm">
                        <input type="text" className="form-control" placeholder="Cantidad a vender" value={sellBaseAssetInput} onChange={handleSellBaseAsset} />
                        <span className="input-group-text" id="inputGroup-sizing-sm">{showBaseAsset}</span>
                    </div>
                    <input type="range" className="form-range" value={sellRangeValue} onChange={(event) => handleRangeChange(event, setSellRangeValue, getBaseAsset(), "SELL")} />
                    <div className="input-group input-group-sm">
                        <input type="text" className="form-control" placeholder="Total (sin comisiones)" value={sellQuoteAssetInput} onChange={handleSellQuoteAsset} />
                        <span className="input-group-text" id="inputGroup-sizing-sm">{showQuoteAsset}</span>
                    </div>
                    <div className="mt-1 mb-1">
                        Comisión estimada: {(sellBaseAssetInput * tradingComision).toFixed(8)} {showBaseAsset}
                    </div>
                    <button className="btn btn-danger w-100 mb-2" onClick={onSell}>Vender {showBaseAsset}</button>
                </div>
            </div>
        </>
    );
}

export default BuyAndSell;
