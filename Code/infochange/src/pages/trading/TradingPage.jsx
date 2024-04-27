import React, { useEffect, useRef, useState } from 'react';

import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

import SymbolSearch from './components/SymbolSearch';
import RotatingMarquee from './components/RotatingMarquee';
import { useTrading } from './context/TradingContext';

import "./TradingPage.css";
import BuyAndSell from './components/BuyAndSell';

// meter a parte de TOP (que es como lo que esta puesto, que son los marqueePairs pero mejor poner el top 10) un favoritos
// poner lo de las comas y punto
// hacer que la barra se actualice tmb si cambias el precio manualmente y poner la barra a 5 tramos nama
// que se cambie lo que te van a dar si se actualiza el precio

// Componente CHART es lo mas importante que falta, luego refactor al context

function TradingPage() {
  const { getActualPair } = useTrading();

  const updateMode = () => setMode(mode => (mode + 1) % 2);
  const container = useRef();

  const [newbieChart, setNewbieChart] = useState(null);
  const [proChart, setProChart] = useState(null);

  const [mode, setMode] = useState(0);

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
        <div className="row" style={{ marginTop: "10px" }}>
          <BuyAndSell />
        </div>
      </div>
    </>
  );
}

export default TradingPage;
