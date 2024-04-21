import React, { useEffect, useRef, useState } from 'react';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import SymbolItem from './SymbolItem';

// METER EN SYMBOLS EL BASEASSETPRECISION Y EL QUOTEASSETPRECISION
// METER EN SYMBOLS EL NOMBRE COMPLETO DE LA MONEDA
import Symbols from "../../data/Symbols.json";
import CoinMarketCapData from "../../data/CoinMarketCapData.json";

import "./trading.css";
import { useParams } from 'react-router-dom';

// arreglar lod el 75vh
// cuando le des click a una moneda que se cambie el enlace de arriba sin recargar la pagina
// poner la moneda seleccionada
// onmouseover
// copiarse de binance
/*
*
*  const getFullName = (symbol) => {
    const info = CoinMarketCapData.data[symbol][0];
    return info == null ? symbol : info.name;
  }

  useEffect(() => {
    const a = Symbols.symbols.map((s) => {
      return ({
        symbol: s.symbol,
        step: s.step,
        quoteAsset: s.quoteAsset,
        decimalPlaces: s.decimalPlaces,
        baseAsset: s.baseAsset,
        quoteAssetName: getFullName(s.quoteAsset),
        baseAssetName: getFullName(s.baseAsset),
      });
    })
    console.log(a);
  }, [])*/

// poner que cuando pasas por encima de un par se vea el selccionado
// poner mejor los bordes
// poner lo de abajo mas boinito
// websocket precio
// refactor el de eso
// poner lo de las comas y punto
// 

// IMPORTANTE
// WEBSOCKET Y API CALL PARA LOS PRECIOS DEL MARQUEE

function Trading() {
  const params = useParams();
  const pairPath = params.pair === undefined ? "BTCUSDT" : params.pair.toUpperCase();

  const updateMode = () => setMode(mode => (mode + 1) % 2);
  const container = useRef();

  const tradingComision = 0.0065;
  const pairPrice = 65330;
  const baseAssetAmount = useRef(0);
  const quoteAssetAmount = useRef(100000);

  const [newbieChart, setNewbieChart] = useState(null);
  const [proChart, setProChart] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchPairs, setSearchPairs] = useState([]);
  const [mode, setMode] = useState(0);
  const [actualPair, setPair] = useState(getPair(pairPath));

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

    const newValue = (rangeValue / 100) * quoteAssetAmount.current;
    updateBuyQuoteAsset(newValue == 0 ? "" : newValue);
    setBuyRangeValue(rangeValue);
  }

  // SELL RANGE
  const [sellRangeValue, setSellRangeValue] = useState(0);
  const handleSellRangeChange = (event) => {
    const rangeValue = parseInt(event.target.value);

    const newValue = (rangeValue / 100) * baseAssetAmount.current;
    updateSellBaseAsset(newValue == 0 ? "" : newValue);
    setSellRangeValue(rangeValue);
  }

  // BUY ACTION
  const onBuy = () => {
    const receivedBaseAssetAmount = parseFloat(buyBaseAssetInput);
    const paidQuoteAssetAmount = parseFloat(buyQuoteAssetInput);

    if (!isNaN(receivedBaseAssetAmount) && !isNaN(paidQuoteAssetAmount)) {
      baseAssetAmount.current += receivedBaseAssetAmount;
      quoteAssetAmount.current -= paidQuoteAssetAmount;

      const modal = new bootstrap.Modal(document.getElementById('just-close-modal'));
      const modalTitle = document.getElementById('just-close-modal-title');
      modalTitle.innerHTML = `Compra realizada con éxito`;
      const modalBody = document.getElementById('just-close-modal-body');
      modalBody.innerHTML = `Has comprado <b>` + receivedBaseAssetAmount.toFixed(8) + " " + actualPair.baseAsset + "</b> por <b>" +
        paidQuoteAssetAmount.toFixed(8) + " " + actualPair.quoteAsset + "</b>";
      modal.show();
    } else {
      alert("El monto de compra introducido no es válido"); // reemplazar por que se ponga rojito algo
    }

    setBuyRangeValue(0);
    setSellRangeValue(0);
    updateSellBaseAsset("");
    updateBuyQuoteAsset("");
  }

  // SELL ACTION
  const onSell = () => {
    const receivedQuoteAssetAmount = parseFloat(sellQuoteAssetInput);
    const paidBaseAssetAmount = parseFloat(sellBaseAssetInput);

    if (!isNaN(receivedQuoteAssetAmount) && !isNaN(paidBaseAssetAmount)) {
      quoteAssetAmount.current += receivedQuoteAssetAmount;
      baseAssetAmount.current -= paidBaseAssetAmount;

      const modal = new bootstrap.Modal(document.getElementById('just-close-modal'));
      const modalTitle = document.getElementById('just-close-modal-title');
      modalTitle.innerHTML = `Venta realizada con éxito`;
      const modalBody = document.getElementById('just-close-modal-body');
      modalBody.innerHTML = `Has vendido <b>` + paidBaseAssetAmount.toFixed(8) + " " + actualPair.baseAsset + "</b> por <b>" +
        receivedQuoteAssetAmount.toFixed(8) + " " + actualPair.quoteAsset + "</b>";
      modal.show();
    } else {
      alert("El monto de compra introducido no es válido"); // reemplazar por que se ponga rojito algo
    }

    setBuyRangeValue(0);
    setSellRangeValue(0);
    updateSellBaseAsset("");
    updateBuyQuoteAsset("");
  }

  function getBaseAsset() {
    return actualPair === undefined ? "" : actualPair.baseAsset;
  }

  function getQuoteAsset() {
    return actualPair === undefined ? "" : actualPair.quoteAsset;
  }

  function getPair(symbol) {
    return Object.values(Symbols.symbols).filter(s => s.symbol == symbol)[0];
  }

  function filterPairs(regex = "") {
    if (Symbols.symbols == null)
      return [];

    return Object.values(Symbols.symbols).filter(s =>
      s.baseAssetName.toUpperCase().startsWith(regex.toUpperCase()) ||
      s.symbol.startsWith(regex.toUpperCase()));
  }

  const searchHandler = () => {
    console.log(searchInput);
  }

  function getTokenInfo(token) {
    return CoinMarketCapData.data[token.toUpperCase()][0];
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


  let searchPairsObject = searchPairs.map(p => {
    const onSymbolClick = () => {
      setPair(p);
      setSearchInput("");
      setSearchPairs([]);
    }
    return (
      <SymbolItem key={p.symbol} tokenInfo={getTokenInfo(p.baseAsset)} pair={p} regex={searchInput} clickHandler={onSymbolClick} />
    );
  });


  // METER LOS ROTATING MARQUEE PARA QUE SEA CICLICO Y NO TODO EL ELEMENTO
  return (
    <>
      <div className="rotating-marquee bg-primary">
        <div className="col-2 rotating-marquee-element rme-1 bg-primary">
          <span className="text-white">BTCUSDT: 65540,23$</span>
        </div >
        <div className="col-2 rotating-marquee-element rme-2 bg-primary">
          <span className="text-white">BNBBTC: 650,36$</span>
        </div>
        <div className="col-2 rotating-marquee-element rme-3 bg-primary">
          <span className="text-white">ETHUSDT: 3110,43$</span>
        </div>
        <div className="col-2 rotating-marquee-element rme-4 bg-primary">
          <span className="text-white">LTCUSDT: 84,11$</span>
        </div >
        <div className="col-2 rotating-marquee-element rme-5 bg-primary">
          <span className="text-white">YFIUSDT: 4650,88$</span>
        </div>
        <div className="col-2 rotating-marquee-element rme-6 bg-primary">
          <span className="text-white">DOTUSDT: 10,14$</span>
        </div>
      </div >

      <div class="modal fade" id="just-close-modal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 id="just-close-modal-title" class="modal-title fs-5">Titulo</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div id="just-close-modal-body" class="modal-body">
              Cuerpo
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
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
            <div className="col-md-9 ps-0" style={{ height: "70vh" }}>
              <div className="border border-4 tradingview-widget-container" ref={container}
                style={{ height: "100%", width: "100%", display: (mode == 0 ? "block" : "none") }}>
                <div className="tradingview-widget-container__widget"></div>
              </div>

              <div className="border border-4 tradingview-widget-container"
                style={{ height: "100%", width: "100%", display: (mode == 1 ? "block" : "none") }}>
                {proChart}
              </div>
            </div>
            : // Si la moneda no existe
            <div className="col-md-9 ps-0" style={{ height: "70vh" }}>
              <div className="border d-flex align-items-center justify-content-center" ref={container}
                style={{ height: "100%", width: "100%", display: (mode == 0 ? "block" : "none") }}>
                <div className="alert alert-danger">
                  <span className="h3">El par {pairPath} no existe</span>
                </div>
              </div>
            </div>}

          <div className="col-md-3" style={{ height: "70vh" }}>
            <div className="row">
              <input
                className="form-control"
                type="search"
                placeholder="Buscar par..."
                style={{ backgroundColor: "#ffffff", color: "#000000" }}
                value={searchInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="row border overflow-y-scroll mt-2" style={{ height: "64vh" }}>
              <div className="d-flex flex-column">
                <ul className="list-group list-group-flush">
                  {searchPairsObject}
                </ul>
              </div>
            </div>
          </div>
          <div >
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6 border">
            <div>
              <div className="mt-1 mb-1">
                Disp: {quoteAssetAmount.current.toFixed(8)} {getQuoteAsset()}
              </div>
              <div class="input-group input-group-sm">
                <input type="text" class="form-control" placeholder="Cantidad a comprar" value={buyQuoteAssetInput}
                  onChange={handleBuyQuoteAsset} />
                <span class="input-group-text" id="inputGroup-sizing-sm">{getQuoteAsset()}</span>
              </div>
              <input type="range" class="form-range" value={buyRangeValue} onChange={handleBuyRangeChange} />
              <div class="input-group input-group-sm">
                <input type="text" class="form-control" placeholder="Vas a recibir" value={buyBaseAssetInput}
                  onChange={handleBuyBaseAsset} />
                <span class="input-group-text" id="inputGroup-sizing-sm">{getBaseAsset()}</span>
              </div>
              <div className="mt-1 mb-1">
                Comisión estimada: {(buyQuoteAssetInput * tradingComision).toFixed(8)}  {getQuoteAsset()}
              </div>
              <button className="btn btn-success w-100 mb-2" onClick={onBuy}>Comprar {getBaseAsset()}</button>
            </div>
          </div>
          <div className="col-md-6 border">
            <div className="mt-1 mb-1">
              Disp: {baseAssetAmount.current.toFixed(8)} {getBaseAsset()}
            </div>
            <div>
              <div class="input-group input-group-sm">
                <input type="text" class="form-control" placeholder="Cantidad a vender" value={sellBaseAssetInput}
                  onChange={handleSellBaseAsset} />
                <span class="input-group-text" id="inputGroup-sizing-sm">{getBaseAsset()}</span>
              </div>
              <input type="range" class="form-range" id="customRange2" value={sellRangeValue}
                onChange={handleSellRangeChange} />
              <div class="input-group input-group-sm">
                <input type="text" class="form-control" placeholder="Vas a recibir" value={sellQuoteAssetInput}
                  onChange={handleSellQuoteAsset} />
                <span class="input-group-text" id="inputGroup-sizing-sm">{getQuoteAsset()}</span>
              </div>
              <div className="mt-1 mb-1">
                Comisión estimada: {(sellBaseAssetInput * tradingComision).toFixed(8)} {getBaseAsset()}
              </div>
              <button className="btn btn-danger w-100 mb-2" onClick={onSell}>Vender {getBaseAsset()}</button>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}

export default Trading;
