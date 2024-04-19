import React, { useEffect, useRef } from "react";

const TradingViewWidget = () => {
  const containerRef = useRef();

  useEffect(() => {
    // Comprueba si el script ya existe
    if (document.querySelector("#tradingview-widget-script")) return;

    const script = document.createElement("script");
    script.id = "tradingview-widget-script";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: "BTCUSD|12M",
      width: "550",
      height: "320",
      locale: "es",
      hideMarketStatus: true,
      colorTheme: "light",
      isTransparent: false,
      autosize: false,
      largeChartUrl: "",
      chartOnly: false,
      noTimeScale: false,
      scalePosition: "no",
      dateRanges: [
        "12m|1D",
      ]
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container__widget" ref={containerRef} />
  );
};

export default TradingViewWidget;
