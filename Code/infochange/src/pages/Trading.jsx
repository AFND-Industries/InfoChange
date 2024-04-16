import React, { useEffect, useRef, useState } from 'react';
// import TradingViewWidget, { Themes, IntervalTypes } from 'react-tradingview-widget';

// https://github.com/rafaelklaessen/react-tradingview-widget/blob/master/src/index.js

import { AdvancedRealTimeChart, MiniChart, SymbolOverview, Timeline } from "react-ts-tradingview-widgets";

import "./trading.css";
//

//import { TradingViewEmbed, widgetType } from "react-tradingview-embed";
// https://github.com/k-128/react-tradingview-embed

function Trading() {
  const container = useRef();
  const [mode, setMode] = useState(0);

  const updateMode = () => setMode(mode => (mode + 1) % 2);
  /*const chart = mode == 0 ?
    <TradingViewWidget
      theme={Themes.LIGHT}
      locale="es"
      autosize
      symbol="BINANCE:BTCUSDT"
      interval={IntervalTypes.D}
      timezone="Etc/UTC"
      style={3}
      hide_top_toolbar={true}
      hide_side_toolbar={true}
      studies={{}}
    />
    :
    <TradingViewWidget
      theme={Themes.LIGHT}
      locale="es"
      autosize
      symbol="BINANCE:BTCUSDT"
      interval={IntervalTypes.D}
      timezone="Etc/UTC"
      style={1}
      hide_top_toolbar={false}
      hide_side_toolbar={false}
      allow_symbol_change={false}
    />*/

  const chart = mode == 0 ?
    <SymbolOverview
      locale="es"
      autosize
      symbols={["BINANCE:BTCUSDT"]}
      interval="1D"
      timezone="Etc/UTC"
      style={3}
      hide_top_toolbar={true}
      hide_side_toolbar={true}
      studies={{}}
    />
    :
    <AdvancedRealTimeChart
      locale="es"
      autosize
      symbol="BINANCE:BTCUSDT"
      interval="1D"
      timezone="Etc/UTC"
      style={1}
      hide_top_toolbar={false}
      hide_side_toolbar={false}
      allow_symbol_change={false}
    />
  useEffect(() => {
    try {
      setTimeout(() => {
        console.log(document.getElementsByTagName("iframe")[0].contentWindow)
      }, 3000);

      document.querySelector("label__link-viu2QKQw").remove();
    } catch (e) {

    }
  }, [mode]);

  return (
    <div className="container mt-2 mb-5 d-flex flex-column" style={{ height: "75vh", display: "flex" }}>
      <div className="row">
        <div className="col">
          <button className="btn btn-primary mt-2 mb-2" onClick={updateMode}>Cambiar modo</button>
        </div>
      </div>

      <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
        {chart}
      </div>
    </div>
  );
}

export default Trading;
