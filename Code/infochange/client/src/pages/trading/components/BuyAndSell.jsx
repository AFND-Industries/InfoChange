import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useTrading } from "../context/TradingContext";
import { useAuth } from "../../authenticator/AuthContext";
import { useAPI } from "../../../context/APIContext";

function BuyAndSell({ style = 1 }) {
    const navigate = useNavigate();

    const MAXVALUE = 1000000000000;

    const { getActualPair, getActualPairPrice } = useTrading();
    const { getAuthStatus, getActualUserWallet } = useAuth();
    const { doTrade, getPair } = useAPI();

    useEffect(() => {
        if (getAuthStatus() !== "-2" && getAuthStatus() !== "1")
            style = 0;
    }, [getAuthStatus()]);

    const actualUserWallet = getActualUserWallet();
    const totalMoney = actualUserWallet === null ? 0 : actualUserWallet.map(c => { // esto va a dashboard
        let dollarAmount;
        if (c.coin === "USDT") dollarAmount = c.quantity;
        else {
            const usdPair = getPair(c.coin + "USDT");
            dollarAmount = c.quantity * (usdPair.price ?? 0);
        }

        return dollarAmount;
    }).reduce((total, currentValue) => total + currentValue, 0);

    const getWalletAmount = (symbol) => {
        let balance = 0;

        if (actualUserWallet !== null) {
            const search = Object.values(actualUserWallet).filter(w => w.coin === symbol);
            if (search.length > 0)
                balance = search[0].quantity;
        }
        return parseFloat(balance.toFixed(8));
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

    const countDecimals = (number) => {
        const decimalIndex = number.indexOf('.');
        return decimalIndex === -1 ? 0 : number.length - decimalIndex - 1;
    }

    const updateInputValues = (value, setValueFunc, oppositeSetValueFunc, action, assetChanged) => {
        const valueTrim = value.trim();
        const parsedValue = parseFloat(valueTrim);

        if (valueTrim.length == 0 || (!isNaN(valueTrim) && parsedValue >= 0 && countDecimals(valueTrim) <= 8 && parsedValue <= MAXVALUE)) {
            setValueFunc(valueTrim);
            const oppositeValue = assetChanged === "BASE" ? valueTrim * getActualPairPrice() : valueTrim / getActualPairPrice();
            oppositeSetValueFunc(valueTrim.length == 0 ? "" : oppositeValue.toFixed(8));

            const amountDisp = getWalletAmount(action === "BUY" ? getQuoteAsset() : getBaseAsset());

            let rangeValue;
            if (amountDisp > 0) {
                if (action === "BUY" && assetChanged === "QUOTE") rangeValue = 100 * valueTrim / amountDisp;
                else if (action === "BUY" && assetChanged === "BASE") rangeValue = 100 * valueTrim * getActualPairPrice() / amountDisp;
                else if (action === "SELL" && assetChanged === "BASE") rangeValue = 100 * valueTrim / amountDisp;
                else if (action === "SELL" && assetChanged === "QUOTE") rangeValue = 100 * (valueTrim / getActualPairPrice()) / amountDisp;

                rangeValue = Math.round(100 * rangeValue) / 100;
            } else {
                rangeValue = 1000;
            }

            if (action === "BUY") setBuyRangeValue(value.length == 0 ? 0 : rangeValue);
            else setSellRangeValue(value.length == 0 ? 0 : rangeValue);
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

        if (action === "BUY") updateInputValues(newValue == 0 ? "" : newValue.toFixed(8), setBuyQuoteAssetInput, setBuyBaseAssetInput, "BUY", "QUOTE");
        else updateInputValues(newValue == 0 ? "" : newValue.toFixed(8), setSellBaseAssetInput, setSellQuoteAssetInput, "SELL", "BASE")
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

    const showJustCloseModal = (title, message) => {
        const modal = new bootstrap.Modal(document.getElementById('just-close-modal'));
        const modalTitle = document.getElementById('just-close-modal-title');
        const modalBody = document.getElementById('just-close-modal-body');

        modalTitle.innerHTML = title;
        modalBody.innerHTML = message;

        modal.show();
    };

    const showTradeConfirmationModal = (title, message, onConfirm) => {
        const modal = new bootstrap.Modal(document.getElementById('trade-confirmation-modal'));
        const modalTitle = document.getElementById('trade-confirmation-modal-title');
        const modalBody = document.getElementById('trade-confirmation-modal-body');
        const tradeConfirmationButton = document.getElementById('trade-confirmation-button');

        tradeConfirmationButton.onclick = () => {
            modal.hide();
            onConfirm();
        };
        modalTitle.innerHTML = title;
        modalBody.innerHTML = message;

        modal.show();
    };

    const showTradeDoneToast = (title, message) => {
        const toast = new bootstrap.Toast(document.getElementById("trade-toast"), {
            autohide: true
        });
        const toastTitle = document.getElementById("trade-toast-title");
        const toastBody = document.getElementById("trade-toast-body");

        toastTitle.innerHTML = title;
        toastBody.innerHTML = message;

        toast.show();
    }

    const performTransaction = async (paidAmount, action) => {
        const baseAsset = getBaseAsset();
        const quoteAsset = getQuoteAsset();

        const comission = paidAmount * tradingComision;
        const receivedAmount = (paidAmount - comission) * (action === "BUY" ? 1 / getActualPairPrice() : getActualPairPrice());
        const symbol = action === "BUY" ? quoteAsset : baseAsset;

        if (getActualPairPrice() <= 0 || isNaN(receivedAmount) || isNaN(paidAmount) || paidAmount <= 0) {
            showJustCloseModal("Error", "El monto de la transacción introducido no es válido");
            return;
        }

        if (getWalletAmount(symbol) < parseFloat(paidAmount.toFixed(8))) {
            showJustCloseModal("Error", `No tienes suficientes ${action === "BUY" ? showQuoteAsset : showBaseAsset} `);
            return;
        }

        const transac = async () => await doTransaction(paidAmount, receivedAmount, comission, action);
        if (style == 0) {
            if (action == "BUY")
                showTradeConfirmationModal("¡ATENCIÓN!",
                    `Estás a punto de comprar <b>${receivedAmount.toFixed(8)} ${showBaseAsset}</b>. ¿Estás seguro?`
                    , transac);
            else
                showTradeConfirmationModal("¡ATENCIÓN!",
                    `Estás a punto de vender <b>${paidAmount.toFixed(8)} ${showBaseAsset}</b>. ¿Estás seguro?`
                    , transac);
        }
        else transac();
    };

    const doTransaction = async (paidAmount, receivedAmount, comission, action) => {
        const loadingScreen = document.getElementById("loading-screen");

        loadingScreen.style.display = "block";
        const response = await doTrade(getActualPair().symbol, paidAmount, action);
        loadingScreen.style.display = "none";

        if (response !== undefined && response.data.status === "1") {
            if (action === "BUY") {
                showTradeDoneToast(`Compra realizada con éxito`,
                    `Has comprado <b>${response.data.receivedAmount.toFixed(8)} ${showBaseAsset}</b> por <b>${response.data.paidAmount.toFixed(showQuoteDecimals)}${showQuoteAsset}
                    </b> y has pagado <b> ${response.data.comission.toFixed(showQuoteDecimals)}${showQuoteAsset}</b> de comisión.`);
            } else {
                showTradeDoneToast(`Venta realizada con éxito`,
                    `Has vendido <b>${response.data.paidAmount} ${showBaseAsset}</b> por <b>${response.data.receivedAmount.toFixed(showQuoteDecimals)}${showQuoteAsset}
                    </b> y has pagado <b>${response.data.comission.toFixed(8)} ${showBaseAsset}</b> de comisión.`);
            }
        } else {
            console.log("Algo ha salido mal con el trade... (Hacer aqui un toast)", response);
        }
    }

    const onBuy = async () => {
        const paidAmount = parseFloat(buyQuoteAssetInput);
        await performTransaction(paidAmount, "BUY");
    };

    const onSell = async () => {
        const paidAmount = parseFloat(sellBaseAssetInput);
        await performTransaction(paidAmount, "SELL");
    };

    const notLoggedButton =
        <button className="btn w-100 mb-2" style={{ backgroundColor: "rgb(108, 117, 125)", fontWeight: "bold", cursor: "default" }}>
            <span style={{ color: "#ffbb00", cursor: "pointer" }} onClick={() => navigate("/login")}>Inicia sesión</span>
            <span className="text-white"> o </span>
            <span style={{ color: "#ffbb00", cursor: "pointer" }} onClick={() => navigate("/register")}>Regístrate ahora</span>
        </button>

    const trunc = (number, n) => Math.trunc(number * Math.pow(10, n)) / (Math.pow(10, n));

    return (
        <>
            <div className="col-md border border-4 rounded me-1">
                <div className="mt-1 mb-1">
                    Disponible: {trunc(getWalletAmount(getQuoteAsset()), showQuoteDecimals).toFixed(showQuoteDecimals)}{showQuoteAsset}
                </div>
                <div className="input-group input-group-sm">
                    <input type="text" className="form-control" placeholder="Cantidad a comprar" value={buyQuoteAssetInput} onChange={handleBuyQuoteAsset} />
                    <span className="input-group-text" id="inputGroup-sizing-sm">{showQuoteAsset}</span>
                </div>
                {style == 1 && <>
                    <input type="range" className="form-range" value={buyRangeValue}
                        onChange={(event) => handleRangeChange(event, setBuyRangeValue, getQuoteAsset(), "BUY")} />
                    <div className="input-group input-group-sm">
                        <input type="text" className="form-control" placeholder="Total (sin comisiones)" value={buyBaseAssetInput} onChange={handleBuyBaseAsset} />
                        <span className="input-group-text" id="inputGroup-sizing-sm">{showBaseAsset}</span>
                    </div>
                </>}
                <div className="mt-1 mb-1 d-flex justify-content-between">
                    {style == 0 && <span>Vas a recibir: {(buyBaseAssetInput * 1).toFixed(8)} {showBaseAsset}</span>}
                    Comisión estimada: {(buyQuoteAssetInput * tradingComision).toFixed(showQuoteDecimals)}{showQuoteAsset}
                </div>
                {getAuthStatus() !== "1" ?
                    notLoggedButton :
                    <button className="btn btn-success w-100 mb-2" onClick={onBuy}> Comprar {showBaseAsset}</button>}
            </div>
            <div className="col-md border border-4 rounded ms-2">
                <div className="mt-1 mb-1">
                    Disponible: {trunc(getWalletAmount(getBaseAsset()), 8).toFixed(8)} {showBaseAsset}
                </div>
                <div>
                    <div className="input-group input-group-sm">
                        <input type="text" className="form-control" placeholder="Cantidad a vender" value={sellBaseAssetInput} onChange={handleSellBaseAsset} />
                        <span className="input-group-text" id="inputGroup-sizing-sm">{showBaseAsset}</span>
                    </div>
                    {style == 1 &&
                        <>
                            <input type="range" className="form-range" value={sellRangeValue}
                                onChange={(event) => handleRangeChange(event, setSellRangeValue, getBaseAsset(), "SELL")} />
                            <div className="input-group input-group-sm">
                                <input type="text" className="form-control" placeholder="Total (sin comisiones)" value={sellQuoteAssetInput} onChange={handleSellQuoteAsset} />
                                <span className="input-group-text" id="inputGroup-sizing-sm">{showQuoteAsset}</span>
                            </div>
                        </>}
                    <div className="mt-1 mb-1 d-flex justify-content-between">
                        {style == 0 && <span>Vas a recibir: {(sellQuoteAssetInput * 1).toFixed(showQuoteDecimals)}$</span>}
                        <span>Comisión estimada: {(sellBaseAssetInput * tradingComision).toFixed(8)} {showBaseAsset}</span>
                    </div>
                    {getAuthStatus() !== "1" ?
                        notLoggedButton :
                        <button className="btn btn-danger w-100 mb-2" onClick={onSell}>Vender {showBaseAsset}</button>}
                </div>
            </div >
        </>
    );
}

export default BuyAndSell;
