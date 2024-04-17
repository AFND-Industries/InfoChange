import React, { useEffect, useRef, useState } from 'react';
import { AdvancedRealTimeChart, SymbolOverview } from "react-ts-tradingview-widgets";

import "./trading.css";

function Trading() {
  const [newbieChart, setNewbieChart] = useState(null);
  const [proChart, setProChart] = useState(null);

  const [mode, setMode] = useState(0);
  let coinName = window.location.pathname.substring(9);
  coinName = coinName.length == 0 ? "BTCUSDT" : coinName;

  const updateMode = () => setMode(mode => (mode + 1) % 2);
  const container = useRef();

  useEffect(() => {
    const pair = "BINANCE:" + coinName;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "symbols": "` + pair + `|7D",
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
      symbol={pair}
      interval="1D"
      timezone="Etc/UTC"
      style={1}
      hide_top_toolbar={false}
      hide_side_toolbar={false}
      allow_symbol_change={false}
    />)

    return (() => {
      container.current.innerHTML = "";
    });
  }, [coinName])

  return (

    <div className="container mt-2 mb-5 d-flex flex-column" style={{ height: "75vh", display: "flex" }}>
      <div className="row">
        <div className="col">
          <button className="btn btn-primary mt-2 mb-2" onClick={updateMode}>Cambiar modo</button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-9" style={{ height: "75vh" }}>
          <div className="tradingview-widget-container" ref={container}
            style={{ height: "100%", width: "100%", display: (mode == 0 ? "block" : "none") }}>
            <div className="tradingview-widget-container__widget"></div>
          </div>

          <div className="tradingview-widget-container"
            style={{ height: "100%", width: "100%", display: (mode == 1 ? "block" : "none") }}>
            {proChart}
          </div>
        </div>
        <div className="col-md-3 border" style={{ height: "75vh" }}>
          <div className="d-flex mt-3">
            <div className="dropdown w-100">
              <input
                className="form-control"
                type="search"
                placeholder="Buscar par..."
                style={{ backgroundColor: "#ffffff", color: "#000000" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div >

  );
}

export default Trading;
