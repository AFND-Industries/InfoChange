import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

import SymbolItem from './components/SymbolItem';
import RotatingMarquee from './components/RotatingMarquee';
import { useTrading } from './context/TradingContext';

import Symbols from "../../data/Symbols.json";
import CoinMarketCapData from "../../data/CoinMarketCapData.json";
import axios from 'axios';

import "./TradingPage.css";


// meter a parte de TOP (que es como lo que esta puesto, que son los marqueePairs pero mejor poner el top 10) un favoritos
// poner lo de las comas y punto
// hacer que la barra se actualice tmb si cambias el precio manualmente y poner la barra a 5 tramos nama
// que se cambie lo que te van a dar si se actualiza el precio

function TradingPage() {
  const { getPair, getTokenInfo, filterPairs } = useTrading();
  const params = useParams();

  const pairPath = params.pair === undefined ? "BTCUSDT" : params.pair.toUpperCase();

  const updateMode = () => setMode(mode => (mode + 1) % 2);
  const container = useRef();

  const marqueePairs = [
    "BTCUSDT",
    "ETHUSDT",
    "LTCUSDT",
    "LINKUSDT",
    "DOTUSDT",
    "VITEUSDT"] // Must be 6 items

  const topPairs = [
    "BTCUSDT",
    "ETHUSDT",
    "BNBUSDT",
    "SOLUSDT",
    "XRPUSDT",
    "DOGEUSDT",
    "ADAUSDT",
    "SHIBUSDT",
    "AVAXUSDT",
    "TRXUSDT"
  ]

  const [symbols, setSymbols] = useState(Symbols.symbols);
  const [newbieChart, setNewbieChart] = useState(null);
  const [proChart, setProChart] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchPairs, setSearchPairs] = useState([]);
  const [mode, setMode] = useState(0);
  const [actualPair, setPair] = useState(getPair(pairPath));

  const [myWallet, setMyWallet] = useState({ "USDT": 100000 });
  const getWalletAmount = (symbol) => myWallet[symbol] === undefined ? 0 : myWallet[symbol];

  const tradingComision = 0.0065;

  const pairPrice = actualPair === undefined || symbols[0].price === undefined ? -1 : getPair(actualPair.symbol).price;

  // BUY QUOTE
  const [buyQuoteAssetInput, setBuyQuoteAssetInput] = useState("");
  const updateBuyQuoteAsset = (value) => {
    const newValue = parseFloat(value);

    if (!isNaN(newValue)) {
      setBuyQuoteAssetInput(newValue);
      setBuyBaseAssetInput((newValue / pairPrice).toFixed(8));
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
      setBuyQuoteAssetInput((newValue * pairPrice).toFixed(8));
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
      setSellQuoteAssetInput((newValue * pairPrice).toFixed(8));
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
      setSellBaseAssetInput((newValue / pairPrice).toFixed(8));
    } else {
      setSellQuoteAssetInput("");
      setSellBaseAssetInput("");
    }
  }

  // BUY RANGE
  const [buyRangeValue, setBuyRangeValue] = useState(0);
  const handleBuyRangeChange = (event) => {
    const rangeValue = parseInt(event.target.value);

    const newValue = (rangeValue / 100) * getWalletAmount(actualPair.quoteAsset);
    updateBuyQuoteAsset(newValue == 0 ? "" : newValue);
    setBuyRangeValue(rangeValue);
  }

  // SELL RANGE
  const [sellRangeValue, setSellRangeValue] = useState(0);
  const handleSellRangeChange = (event) => {
    const rangeValue = parseInt(event.target.value);

    const newValue = (rangeValue / 100) * getWalletAmount(actualPair.baseAsset);
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
  }, [actualPair, myWallet]);

  // BUY ACTION
  const onBuy = () => {
    const paidQuoteAssetAmount = parseFloat(buyQuoteAssetInput);
    const quoteComision = paidQuoteAssetAmount * tradingComision;

    const receivedBaseAssetAmount = (paidQuoteAssetAmount - quoteComision) / pairPrice;

    clearAmountInputs();

    if (pairPrice <= 0) {
      return;
    }

    if (isNaN(receivedBaseAssetAmount) || isNaN(paidQuoteAssetAmount)) {
      alert("El monto de compra introducido no es válido"); // reemplazar por que se ponga rojito algo
      return;
    }

    if (getWalletAmount(actualPair.quoteAsset) < paidQuoteAssetAmount) {
      alert("No tienes " + actualPair.quoteAsset + " suficientes");
      return;
    }

    myWallet[actualPair.baseAsset] = getWalletAmount(actualPair.baseAsset) + receivedBaseAssetAmount;
    myWallet[actualPair.quoteAsset] = getWalletAmount(actualPair.quoteAsset) - paidQuoteAssetAmount;

    const newWallet = { ...myWallet };
    setMyWallet(newWallet);

    const modal = new bootstrap.Modal(document.getElementById('just-close-modal'));
    const modalTitle = document.getElementById('just-close-modal-title');
    modalTitle.innerHTML = `Compra realizada con éxito`;
    const modalBody = document.getElementById('just-close-modal-body');
    modalBody.innerHTML = `Has comprado <b>` + receivedBaseAssetAmount.toFixed(8) + " " + actualPair.baseAsset + "</b> por <b>" +
      paidQuoteAssetAmount.toFixed(8) + " " + actualPair.quoteAsset + "</b> y has pagado <b>" +
      quoteComision.toFixed(8) + " " + actualPair.quoteAsset + "</b> de comisión.";
    modal.show();
  }

  // SELL ACTION
  const onSell = () => {
    const paidBaseAssetAmount = parseFloat(sellBaseAssetInput);
    const baseComision = paidBaseAssetAmount * tradingComision;

    const receivedQuoteAssetAmount = (paidBaseAssetAmount - baseComision) * pairPrice;

    clearAmountInputs();

    if (pairPrice <= 0) {
      return;
    }

    if (isNaN(receivedQuoteAssetAmount) || isNaN(paidBaseAssetAmount)) {
      alert("El monto de compra introducido no es válido");
      return;
    }

    if (getWalletAmount(actualPair.baseAsset) < paidBaseAssetAmount) {
      alert("No tienes " + actualPair.baseAsset + " suficientes");
      return;
    }

    myWallet[actualPair.quoteAsset] = getWalletAmount(actualPair.quoteAsset) + receivedQuoteAssetAmount;
    myWallet[actualPair.baseAsset] = getWalletAmount(actualPair.baseAsset) - paidBaseAssetAmount;

    const newWallet = { ...myWallet };
    setMyWallet(newWallet);

    const modal = new bootstrap.Modal(document.getElementById('just-close-modal'));
    const modalTitle = document.getElementById('just-close-modal-title');
    modalTitle.innerHTML = `Venta realizada con éxito`;
    const modalBody = document.getElementById('just-close-modal-body');
    modalBody.innerHTML = `Has vendido <b>` + paidBaseAssetAmount.toFixed(8) + " " + actualPair.baseAsset + "</b> por <b>" +
      receivedQuoteAssetAmount.toFixed(8) + " " + actualPair.quoteAsset + "</b> y has pagado <b>" +
      baseComision.toFixed(8) + " " + actualPair.baseAsset + "</b> de comisión.";
    modal.show();
  }

  function getBaseAsset() {
    return actualPair === undefined ? "" : actualPair.baseAsset;
  }

  function getQuoteAsset() {
    return actualPair === undefined ? "" : actualPair.quoteAsset;
  }



  const searchHandler = () => {
    console.log(searchInput);
  }

  const handleInputChange = (event) => {
    if (event.target.value.length === 0) setSearchPairs([]);
    else setSearchPairs(filterPairs(event.target.value));

    setSearchInput(event.target.value);
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') searchHandler();
  }

  useEffect(() => {
    if (actualPair !== undefined) {
      window.history.replaceState(null, null, "/trading/" + actualPair.symbol);

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify(
        {
          symbols: actualPair.symbol + "|7D",
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
        symbol={actualPair.symbol}
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
  }, [actualPair])

  let searchPairsObject = [];
  if (searchInput.length == 0) {
    searchPairsObject = topPairs.map(pair => {
      const p = getPair(pair);
      const onSymbolClick = () => {
        setPair(p);
        setSearchInput("");
        setSearchPairs([]);
      }
      return (
        <SymbolItem key={p.symbol} tokenInfo={getTokenInfo(p.baseAsset)} pair={p} regex={searchInput}
          clickHandler={onSymbolClick} actualPair={actualPair != null && p.symbol == actualPair.symbol} />
      );
    });
  } else {
    searchPairsObject = searchPairs.map(p => {
      const onSymbolClick = () => {
        setPair(p);
        setSearchInput("");
        setSearchPairs([]);
      }
      return (
        <SymbolItem key={p.symbol} tokenInfo={getTokenInfo(p.baseAsset)} pair={p} regex={searchInput}
          clickHandler={onSymbolClick} actualPair={p.symbol == actualPair.symbol} />
      );
    });
  }

  // METER LOS ROTATING MARQUEE PARA QUE SEA CICLICO Y NO TODO EL ELEMENTO
  return (
    <>
      <RotatingMarquee pairs={marqueePairs} />

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
          {actualPair !== undefined ? // Si la moneda existe
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
            <div className="row">
              <input
                className="form-control border border-4 rounded"
                type="search"
                placeholder="Buscar par..."
                style={{ backgroundColor: "#ffffff", color: "#000000" }}
                value={searchInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="row border overflow-y-scroll mt-2 border border-4 rounded" style={{ height: "64vh" }}>
              <div className="d-flex flex-column">
                <ul className="list-group list-group-flush">
                  {searchPairsObject}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6 border border-4 rounded">
            <div>
              <div className="mt-1 mb-1">
                Disp: {actualPair === undefined ? 0 : getWalletAmount(actualPair.quoteAsset).toFixed(8)} {getQuoteAsset()}
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
              Disp: {actualPair === undefined ? 0 : getWalletAmount(actualPair.baseAsset).toFixed(8)} {getBaseAsset()}
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
