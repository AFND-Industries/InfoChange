import React, { useEffect, useRef, useState } from 'react';

const proChartConf = `
{
  "autosize": true,
  "symbol": "BINANCE:BTCUSDT",
  "interval": "D",
  "timezone": "Etc/UTC",
  "theme": "light",
  "style": "1",
  "locale": "es",
  "enable_publishing": false,
  "allow_symbol_change": false,
  "calendar": false,
  "support_host": "https://www.tradingview.com"
}`;

const newbieChartConf = `
{
  "autosize": true,
  "symbol": "BINANCE:BTCUSDT",
  "interval": "D",
  "timezone": "Etc/UTC",
  "theme": "light",
  "style": "3",
  "locale": "es",
  "enable_publishing": false,
  "allow_symbol_change": false,
  "calendar": false,
  "support_host": "https://www.tradingview.com"
}`;

function getConfiguration(mode) {
  return mode == 0 ? newbieChartConf : proChartConf;
}

function Trading() {
  const container = useRef();
  const [mode, setMode] = useState(0);

  const updateMode = () => setMode((mode + 1) % 2);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = getConfiguration(mode);
    container.current.appendChild(script);
    console.log(mode);
    return () => {
      container.current.innerHTML = '';
    };
  }, [mode]);

  return (
    <div className="container mt-2 mb-5 d-flex flex-column" style={{ height: "75vh", display: "flex" }}>
      <div className="row">
        <div className="col">
          <button className="btn btn-primary mt-2 mb-2" onClick={updateMode}>Cambiar modo</button>
        </div>
      </div>

      <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
        <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
        <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a></div>
      </div>
    </div>
  );
}

export default Trading;
