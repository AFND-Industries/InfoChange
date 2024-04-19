import React, { useEffect, useRef } from "react";

const TradingViewWidget = () => {
  const containerRef = useRef();

  useEffect(() => {
    // Comprueba si el script ya existe
    if (document.querySelector("#tradingview-widget-script")) return;

    const script = document.createElement("script");
    script.id = "tradingview-widget-script";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: "BITSTAMP:BTCUSD",
      width: "350",
      height: "220",
      locale: "es",
      dateRange: "3M",
      colorTheme: "light",
      isTransparent: false,
      autosize: false,
      largeChartUrl: "",
      chartOnly: false,
      noTimeScale: false,
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container__widget" ref={containerRef} />
  );
};

export default TradingViewWidget;
