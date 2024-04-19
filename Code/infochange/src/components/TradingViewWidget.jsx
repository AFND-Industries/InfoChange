import React, { useEffect } from "react";

const TradingViewWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");

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

    document
      .getElementsByClassName("tradingview-widget-container__widget")[0]
      .appendChild(script);

    return () => {
      document
        .getElementsByClassName("tradingview-widget-container__widget")[0]
        .removeChild(script);
    };
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default TradingViewWidget;
