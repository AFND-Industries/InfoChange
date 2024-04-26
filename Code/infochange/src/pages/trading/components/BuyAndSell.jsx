import React, { useState, useEffect } from "react";
import { useTrading } from "../context/TradingContext";

function BuyAndSell() {
    const { getActualPair, getActualPairPrice } = useTrading();

    const [myWallet, setMyWallet] = useState({ "USDT": 100000 });
    const getWalletAmount = (symbol) => myWallet[symbol] || 0;

    const tradingComision = 0.00065;

    const [buyQuoteAssetInput, setBuyQuoteAssetInput] = useState("");
    const [buyBaseAssetInput, setBuyBaseAssetInput] = useState("");
    const [sellBaseAssetInput, setSellBaseAssetInput] = useState("");
    const [sellQuoteAssetInput, setSellQuoteAssetInput] = useState("");

    const [buyRangeValue, setBuyRangeValue] = useState(0);
    const [sellRangeValue, setSellRangeValue] = useState(0);

    const getBaseAsset = () => getActualPair()?.baseAsset || "";
    const getQuoteAsset = () => getActualPair()?.quoteAsset || "";

    const updateInputValues = (value, setValueFunc, oppositeSetValueFunc, action) => {
        const newValue = parseFloat(value);

        if (!isNaN(newValue)) {
            setValueFunc(newValue);
            const oppositeValue = action === "BUY" ? newValue / getActualPairPrice() : newValue * getActualPairPrice();
            oppositeSetValueFunc(oppositeValue.toFixed(8));
        } else {
            setValueFunc("");
            oppositeSetValueFunc("");
        }
    };

    const handleAssetChange = (event, setValueFunc, oppositeSetValueFunc, action) => {
        updateInputValues(event.target.value, setValueFunc, oppositeSetValueFunc, action);
    };

    const handleBuyQuoteAsset = (event) => handleAssetChange(event, setBuyQuoteAssetInput, setBuyBaseAssetInput, "BUY");
    const handleBuyBaseAsset = (event) => handleAssetChange(event, setBuyBaseAssetInput, setBuyQuoteAssetInput, "BUY");
    const handleSellBaseAsset = (event) => handleAssetChange(event, setSellBaseAssetInput, setSellQuoteAssetInput, "SELL");
    const handleSellQuoteAsset = (event) => handleAssetChange(event, setSellQuoteAssetInput, setSellBaseAssetInput, "SELL");

    const handleRangeChange = (event, setValueFunc, oppositeSetValueFunc, asset) => {
        const rangeValue = parseInt(event.target.value);
        const newValue = (rangeValue / 100) * getWalletAmount(asset);
        setValueFunc(rangeValue);
        oppositeSetValueFunc(newValue.toFixed(8));
    };

    const clearAmountInputs = () => {
        setBuyRangeValue(0);
        setSellRangeValue(0);
        updateInputValues("", setSellBaseAssetInput, setSellQuoteAssetInput);
        updateInputValues("", setBuyQuoteAssetInput, setBuyBaseAssetInput);
    };

    useEffect(() => {
        clearAmountInputs();
    }, [getActualPair(), myWallet]);

    const performTransaction = (paidAmount, baseAsset, quoteAsset, action) => {
        const comission = paidAmount * tradingComision;
        const receivedAmount = (paidAmount - comission) * (action === "BUY" ? 1 / getActualPairPrice() : getActualPairPrice());
        const symbol = action === "BUY" ? quoteAsset : baseAsset;

        if (getActualPairPrice() <= 0 || isNaN(receivedAmount) || isNaN(paidAmount)) {
            alert("El monto de la transacción introducido no es válido");
            return;
        }

        if (getWalletAmount(symbol) < paidAmount) {
            alert(`No tienes suficientes ${symbol}`);
            return;
        }

        const updatedWallet = { ...myWallet };

        const newBaseAssetAmount = getWalletAmount(baseAsset) + (action === "BUY" ? receivedAmount : -paidAmount);
        updatedWallet[baseAsset] = parseFloat(newBaseAssetAmount.toFixed(8));

        const newQuoteAssetAmount = getWalletAmount(quoteAsset) - (action === "BUY" ? paidAmount : -receivedAmount);
        updatedWallet[quoteAsset] = parseFloat(newQuoteAssetAmount.toFixed(8));

        setMyWallet(updatedWallet);

        const modal = new bootstrap.Modal(document.getElementById('just-close-modal'));
        const modalTitle = document.getElementById('just-close-modal-title');
        const modalBody = document.getElementById('just-close-modal-body');

        if (action === "BUY") {
            modalTitle.innerHTML = `Compra realizada con éxito`;
            modalBody.innerHTML = `Has comprado <b>${receivedAmount.toFixed(8)} ${baseAsset}</b> por <b>${paidAmount.toFixed(8)} ${quoteAsset}</b> y has pagado <b>${comission.toFixed(8)} ${quoteAsset}</b> de comisión.`;
        } else {
            modalTitle.innerHTML = `Venta realizada con éxito`;
            modalBody.innerHTML = `Has vendido <b>${paidAmount.toFixed(8)} ${baseAsset}</b> por <b>${receivedAmount.toFixed(8)} ${quoteAsset}</b> y has pagado <b>${comission.toFixed(8)} ${baseAsset}</b> de comisión.`;
        }

        modal.show();
    };

    const onBuy = () => {
        const paidAmount = parseFloat(buyQuoteAssetInput);
        performTransaction(paidAmount, getBaseAsset(), getQuoteAsset(), "BUY");
    };

    const onSell = () => {
        const paidAmount = parseFloat(sellBaseAssetInput);
        performTransaction(paidAmount, getBaseAsset(), getQuoteAsset(), "SELL");
    };

    return (
        <>
            <div className="col-md-6 border border-4 rounded">
                <div>
                    <div className="mt-1 mb-1">
                        Disp: {getWalletAmount(getQuoteAsset()).toFixed(8)} {getQuoteAsset()}
                    </div>
                    <div className="input-group input-group-sm">
                        <input type="text" className="form-control" placeholder="Cantidad a comprar" value={buyQuoteAssetInput} onChange={handleBuyQuoteAsset} />
                        <span className="input-group-text" id="inputGroup-sizing-sm">{getQuoteAsset()}</span>
                    </div>
                    <input type="range" step="25" className="form-range" value={buyRangeValue} onChange={(event) => handleRangeChange(event, setBuyRangeValue, setBuyQuoteAssetInput, getQuoteAsset())} />
                    <div className="input-group input-group-sm">
                        <input type="text" className="form-control" placeholder="Total (sin comisiones)" value={buyBaseAssetInput} onChange={handleBuyBaseAsset} />
                        <span className="input-group-text" id="inputGroup-sizing-sm">{getBaseAsset()}</span>
                    </div>
                    <div className="mt-1 mb-1">
                        Comisión estimada: {(buyQuoteAssetInput * tradingComision).toFixed(8)} {getQuoteAsset()}
                    </div>
                    <button className="btn btn-success w-100 mb-2" onClick={onBuy}>Comprar {getBaseAsset()}</button>
                </div>
            </div>
            <div className="col-md-6 border border-4 rounded">
                <div className="mt-1 mb-1">
                    Disp: {getWalletAmount(getBaseAsset()).toFixed(8)} {getBaseAsset()}
                </div>
                <div>
                    <div className="input-group input-group-sm">
                        <input type="text" className="form-control" placeholder="Cantidad a vender" value={sellBaseAssetInput} onChange={handleSellBaseAsset} />
                        <span className="input-group-text" id="inputGroup-sizing-sm">{getBaseAsset()}</span>
                    </div>
                    <input type="range" step="25" className="form-range" value={sellRangeValue} onChange={(event) => handleRangeChange(event, setSellRangeValue, setSellBaseAssetInput, getBaseAsset())} />
                    <div className="input-group input-group-sm">
                        <input type="text" className="form-control" placeholder="Total (sin comisiones)" value={sellQuoteAssetInput} onChange={handleSellQuoteAsset} />
                        <span className="input-group-text" id="inputGroup-sizing-sm">{getQuoteAsset()}</span>
                    </div>
                    <div className="mt-1 mb-1">
                        Comisión estimada: {(sellBaseAssetInput * tradingComision).toFixed(8)} {getBaseAsset()}
                    </div>
                    <button className="btn btn-danger w-100 mb-2" onClick={onSell}>Vender {getBaseAsset()}</button>
                </div>
            </div>
        </>
    );
}

export default BuyAndSell;
