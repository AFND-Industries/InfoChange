import React, { useEffect, useRef, useState } from 'react';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import SymbolItem from './SymbolItem';

import Symbols from "../../data/Symbols.json";
import CoinMarketCapData from "../../data/CoinMarketCapData.json";

import "./trading.css";
import { useParams } from 'react-router-dom';

// arreglar lod el 75vh
// cuando le des click a una moneda que se cambie el enlace de arriba sin recargar la pagina
// poner la moneda seleccionada
// onmouseover
// copiarse de binance
function Trading() {
  const params = useParams();
  const pairPath = params.pair === undefined ? "BTCUSDT" : params.pair.toUpperCase();

  const [newbieChart, setNewbieChart] = useState(null);
  const [proChart, setProChart] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchPairs, setSearchPairs] = useState([]);
  const [mode, setMode] = useState(0);
  const [actualPair, setPair] = useState(getPair(pairPath));

  const updateMode = () => setMode(mode => (mode + 1) % 2);
  const container = useRef();

  function getPair(symbol) {
    return Object.values(Symbols.symbols).filter(s => s.symbol == symbol)[0];
  }

  function filterPairs(regex = "") {
    if (Symbols.symbols == null)
      return [];

    return Object.values(Symbols.symbols).filter(s => s.symbol.startsWith(regex.toUpperCase()));
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
      script.innerHTML = `
          {
            "symbols": "` + actualPair.symbol + `|7D",
            "width": "100%",
            "height": "100%",
            "locale": "es",
            "autosize": true,
            "hideMarketStatus": true,
            "scalePosition": "right",
            "scaleMode": "Normal",
            "fontFamily": "Arial, sans-serif",
            "fontSize": "10",
            "noTimeScale": false,
            "valuesTracking": "1",
            "changeMode": "price-and-percent",
            "dateRanges": [
              "1d|3",
              "1w|30",
              "1m|1H",
              "3m|4H",
              "6m|1D",
              "12m|1D",
              "all|1W"
            ]
          }`;
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

  return (
    <div className="container mt-2 mb-5 d-flex flex-column">
      <div className="row">
        <div className="col">
          <button className="btn btn-primary mt-2 mb-2" onClick={updateMode}>Cambiar modo</button>
        </div>
      </div>

      <div className="row">
        {actualPair !== undefined ?
          <div className="col-md-9" style={{ height: "70vh" }}>
            <div className="border tradingview-widget-container" ref={container}
              style={{ height: "100%", width: "100%", display: (mode == 0 ? "block" : "none") }}>
              <div className="tradingview-widget-container__widget"></div>
            </div>

            <div className="border tradingview-widget-container"
              style={{ height: "100%", width: "100%", display: (mode == 1 ? "block" : "none") }}>
              {proChart}
            </div>
          </div>
          :
          <div className="col-md-9" style={{ height: "70vh" }}>
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
    </div >

  );
}

export default Trading;
