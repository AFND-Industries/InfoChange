import React, { useEffect, useRef, useState } from 'react';

import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

import SymbolSearch from './components/SymbolSearch';
import RotatingMarquee from './components/RotatingMarquee';
import { useTrading } from './context/TradingContext';

import "./TradingPage.css";

// meter a parte de TOP (que es como lo que esta puesto, que son los marqueePairs pero mejor poner el top 10) un favoritos
// poner lo de las comas y punto
// hacer que la barra se actualice tmb si cambias el precio manualmente y poner la barra a 5 tramos nama
// que se cambie lo que te van a dar si se actualiza el precio

function TradingPage() {
  const { getActualPair, getActualPairPrice } = useTrading();

  const updateMode = () => setMode(mode => (mode + 1) % 2);
  const container = useRef();

  // Must be 6 items


  const [newbieChart, setNewbieChart] = useState(null);
  const [proChart, setProChart] = useState(null);

  const [mode, setMode] = useState(0);

  const [myWallet, setMyWallet] = useState({ "USDT": 100000 });
  const getWalletAmount = (symbol) => myWallet[symbol] === undefined ? 0 : myWallet[symbol];

  const tradingComision = 0.0065;



  // BUY QUOTE
  const [buyQuoteAssetInput, setBuyQuoteAssetInput] = useState("");
  const updateBuyQuoteAsset = (value) => {
    const newValue = parseFloat(value);

    if (!isNaN(newValue)) {
      setBuyQuoteAssetInput(newValue);
      setBuyBaseAssetInput((newValue / getActualPairPrice()).toFixed(8));
    } else {
      setBuyQuoteAssetInput("");
      setBuyBaseAssetInput("");
    }
  }
  const handleBuyQuoteAsset = (event) => updateBuyQuoteAsset(event.target.value);

  // BUY BASE
  const [buyBaseAssetInput, setBuyBaseAssetInput] = useState("");
  const handleBuyBaseAsset = (event) => {
    const newValue = parseFloat(event.target.value);

    if (!isNaN(newValue)) {
      setBuyBaseAssetInput(newValue);
      setBuyQuoteAssetInput((newValue * getActualPairPrice()).toFixed(8));
    } else {
      setBuyQuoteAssetInput("");
      setBuyBaseAssetInput("");
    }
  }

  // SELL BASE
  const [sellBaseAssetInput, setSellBaseAssetInput] = useState("");
  const updateSellBaseAsset = (value) => {
    const newValue = parseFloat(value);

    if (!isNaN(newValue)) {
      setSellBaseAssetInput(newValue);
      setSellQuoteAssetInput((newValue * getActualPairPrice()).toFixed(8));
    } else {
      setSellQuoteAssetInput("");
      setSellBaseAssetInput("");
    }
  }
  const handleSellBaseAsset = (event) => updateSellBaseAsset(event.target.value);

  // SELL QUOTE
  const [sellQuoteAssetInput, setSellQuoteAssetInput] = useState("");
  const handleSellQuoteAsset = (event) => {
    const newValue = parseFloat(event.target.value);

    if (!isNaN(newValue)) {
      setSellQuoteAssetInput(newValue);
      setSellBaseAssetInput((newValue / getActualPairPrice()).toFixed(8));
    } else {
      setSellQuoteAssetInput("");
      setSellBaseAssetInput("");
    }
  }

  // BUY RANGE
  const [buyRangeValue, setBuyRangeValue] = useState(0);
  const handleBuyRangeChange = (event) => {
    const rangeValue = parseInt(event.target.value);

    const newValue = (rangeValue / 100) * getWalletAmount(getActualPair().quoteAsset);
    updateBuyQuoteAsset(newValue == 0 ? "" : newValue);
    setBuyRangeValue(rangeValue);
  }

  // SELL RANGE
  const [sellRangeValue, setSellRangeValue] = useState(0);
  const handleSellRangeChange = (event) => {
    const rangeValue = parseInt(event.target.value);

    const newValue = (rangeValue / 100) * getWalletAmount(getActualPair().baseAsset);
    updateSellBaseAsset(newValue == 0 ? "" : newValue);
    setSellRangeValue(rangeValue);
  }

  const clearAmountInputs = () => {
    setBuyRangeValue(0);
    setSellRangeValue(0);
    updateSellBaseAsset("");
    updateBuyQuoteAsset("");
  }

  useEffect(() => {
    clearAmountInputs();
  }, [getActualPair(), myWallet]);

  // BUY ACTION
  const onBuy = () => {
    const paidQuoteAssetAmount = parseFloat(buyQuoteAssetInput);
    const quoteComision = paidQuoteAssetAmount * tradingComision;

    const receivedBaseAssetAmount = (paidQuoteAssetAmount - quoteComision) / getActualPairPrice();

    clearAmountInputs();

    if (getActualPairPrice() <= 0) {
      return;
    }

    if (isNaN(receivedBaseAssetAmount) || isNaN(paidQuoteAssetAmount)) {
      alert("El monto de compra introducido no es válido"); // reemplazar por que se ponga rojito algo
      return;
    }

    if (getWalletAmount(getActualPair().quoteAsset) < paidQuoteAssetAmount) {
      alert("No tienes " + getActualPair().quoteAsset + " suficientes");
      return;
    }

    myWallet[getActualPair().baseAsset] = getWalletAmount(getActualPair().baseAsset) + receivedBaseAssetAmount;
    myWallet[getActualPair().quoteAsset] = getWalletAmount(getActualPair().quoteAsset) - paidQuoteAssetAmount;

    const newWallet = { ...myWallet };
    setMyWallet(newWallet);

    const modal = new bootstrap.Modal(document.getElementById('just-close-modal'));
    const modalTitle = document.getElementById('just-close-modal-title');
    modalTitle.innerHTML = `Compra realizada con éxito`;
    const modalBody = document.getElementById('just-close-modal-body');
    modalBody.innerHTML = `Has comprado <b>` + receivedBaseAssetAmount.toFixed(8) + " " + getActualPair().baseAsset + "</b> por <b>" +
      paidQuoteAssetAmount.toFixed(8) + " " + getActualPair().quoteAsset + "</b> y has pagado <b>" +
      quoteComision.toFixed(8) + " " + getActualPair().quoteAsset + "</b> de comisión.";
    modal.show();
  }

  // SELL ACTION
  const onSell = () => {
    const paidBaseAssetAmount = parseFloat(sellBaseAssetInput);
    const baseComision = paidBaseAssetAmount * tradingComision;

    const receivedQuoteAssetAmount = (paidBaseAssetAmount - baseComision) * getActualPairPrice();

    clearAmountInputs();

    if (getActualPairPrice() <= 0) {
      return;
    }

    if (isNaN(receivedQuoteAssetAmount) || isNaN(paidBaseAssetAmount)) {
      alert("El monto de compra introducido no es válido");
      return;
    }

    if (getWalletAmount(getActualPair().baseAsset) < paidBaseAssetAmount) {
      alert("No tienes " + getActualPair().baseAsset + " suficientes");
      return;
    }

    myWallet[getActualPair().quoteAsset] = getWalletAmount(getActualPair().quoteAsset) + receivedQuoteAssetAmount;
    myWallet[getActualPair().baseAsset] = getWalletAmount(getActualPair().baseAsset) - paidBaseAssetAmount;

    const newWallet = { ...myWallet };
    setMyWallet(newWallet);

    const modal = new bootstrap.Modal(document.getElementById('just-close-modal'));
    const modalTitle = document.getElementById('just-close-modal-title');
    modalTitle.innerHTML = `Venta realizada con éxito`;
    const modalBody = document.getElementById('just-close-modal-body');
    modalBody.innerHTML = `Has vendido <b>` + paidBaseAssetAmount.toFixed(8) + " " + getActualPair().baseAsset + "</b> por <b>" +
      receivedQuoteAssetAmount.toFixed(8) + " " + getActualPair().quoteAsset + "</b> y has pagado <b>" +
      baseComision.toFixed(8) + " " + getActualPair().baseAsset + "</b> de comisión.";
    modal.show();
  }

  function getBaseAsset() {
    return getActualPair() === undefined ? "" : getActualPair().baseAsset;
  }

  function getQuoteAsset() {
    return getActualPair() === undefined ? "" : getActualPair().quoteAsset;
  }

  useEffect(() => {
    if (getActualPair() !== undefined) {
      window.history.replaceState(null, null, "/trading/" + getActualPair().symbol);

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify(
        {
          symbols: getActualPair().symbol + "|7D",
          width: "100%",
          height: "100%",
          locale: "es",
          autosize: true,
          hideMarketStatus: true,
          scalePosition: "right",
          scaleMode: "Normal",
          fontFamily: "Arial, sans-serif",
          fontSize: "10",
          noTimeScale: false,
          valuesTracking: "1",
          changeMode: "price-and-percent",
          dateRanges: [
            "1d|3",
            "1w|30",
            "1m|1H",
            "3m|4H",
            "6m|1D",
            "12m|1D",
            "all|1W"
          ]
        });
      container.current.appendChild(script);

      setProChart(<AdvancedRealTimeChart
        locale="es"
        autosize
        symbol={getActualPair().symbol}
        interval="1D"
        timezone="Etc/UTC"
        style={1}
        hide_top_toolbar={false}
        hide_side_toolbar={false}
        allow_symbol_change={false}
      />)

      return (() => {
        if (container.current != null)
          container.current.innerHTML = "";
      });
    }
  }, [getActualPair()])

  // METER LOS ROTATING MARQUEE PARA QUE SEA CICLICO Y NO TODO EL ELEMENTO
  return (
    <>
      <RotatingMarquee />

      <div className="modal fade" id="just-close-modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 id="just-close-modal-title" className="modal-title fs-5">Titulo</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div id="just-close-modal-body" className="modal-body">
              Cuerpo
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-2 mb-5 d-flex flex-column">
        <div className="row">
          <div className="col ps-0">
            <button className="btn btn-primary mt-2 mb-2" onClick={updateMode}>Cambiar modo</button>
          </div>
        </div>
        <div className="row">
          {getActualPair() !== undefined ? // Si la moneda existe
            <div className="col-md-9 ps-0">
              <div className="border border-4 rounded tradingview-widget-container" ref={container}
                style={{ height: "100%", width: "100%", display: (mode == 0 ? "block" : "none") }}>
                <div className="tradingview-widget-container__widget"></div>
              </div>

              <div className="border border-4 rounded tradingview-widget-container"
                style={{ height: "100%", width: "100%", display: (mode == 1 ? "block" : "none") }}>
                {proChart}
              </div>
            </div>
            : // Si la moneda no existe
            <div className="col-md-9 ps-0">
              <div className="border border-4 rounded d-flex align-items-center justify-content-center" ref={container}
                style={{ height: "100%", width: "100%", display: (mode == 0 ? "block" : "none") }}>
                <div className="alert alert-danger">
                  <span className="h3">El par {pairPath} no existe</span>
                </div>
              </div>
            </div>}

          <div className="col-md-3">
            <SymbolSearch />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6 border border-4 rounded">
            <div>
              <div className="mt-1 mb-1">
                Disp: {getActualPair() === undefined ? 0 : getWalletAmount(getActualPair().quoteAsset).toFixed(8)} {getQuoteAsset()}
              </div>
              <div className="input-group input-group-sm">
                <input type="text" className="form-control" placeholder="Cantidad a comprar" value={buyQuoteAssetInput}
                  onChange={handleBuyQuoteAsset} />
                <span className="input-group-text" id="inputGroup-sizing-sm">{getQuoteAsset()}</span>
              </div>
              <input type="range" className="form-range" value={buyRangeValue} onChange={handleBuyRangeChange} />
              <div className="input-group input-group-sm">
                <input type="text" className="form-control" placeholder="Total (sin comisiones)" value={buyBaseAssetInput}
                  onChange={handleBuyBaseAsset} />
                <span className="input-group-text" id="inputGroup-sizing-sm">{getBaseAsset()}</span>
              </div>
              <div className="mt-1 mb-1">
                Comisión estimada: {(buyQuoteAssetInput * tradingComision).toFixed(8)}  {getQuoteAsset()}
              </div>
              <button className="btn btn-success w-100 mb-2" onClick={onBuy}>Comprar {getBaseAsset()}</button>
            </div>
          </div>
          <div className="col-md-6 border border-4 rounded">
            <div className="mt-1 mb-1">
              Disp: {getActualPair() === undefined ? 0 : getWalletAmount(getActualPair().baseAsset).toFixed(8)} {getBaseAsset()}
            </div>
            <div>
              <div className="input-group input-group-sm">
                <input type="text" className="form-control" placeholder="Cantidad a vender" value={sellBaseAssetInput}
                  onChange={handleSellBaseAsset} />
                <span className="input-group-text" id="inputGroup-sizing-sm">{getBaseAsset()}</span>
              </div>
              <input type="range" className="form-range" id="customRange2" value={sellRangeValue}
                onChange={handleSellRangeChange} />
              <div className="input-group input-group-sm">
                <input type="text" className="form-control" placeholder="Total (sin comisiones)" value={sellQuoteAssetInput}
                  onChange={handleSellQuoteAsset} />
                <span className="input-group-text" id="inputGroup-sizing-sm">{getQuoteAsset()}</span>
              </div>
              <div className="mt-1 mb-1">
                Comisión estimada: {(sellBaseAssetInput * tradingComision).toFixed(8)} {getBaseAsset()}
              </div>
              <button className="btn btn-danger w-100 mb-2" onClick={onSell}>Vender {getBaseAsset()}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TradingPage;
