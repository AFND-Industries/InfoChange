import React, { useEffect, useRef } from "react";

function SimpleChart({ symbol }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: symbol + "|7D",
      width: "100%",
      height: "100%",
      locale: "es",
      autosize: false,
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
        "all|1W",
      ],
    });
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current != null) containerRef.current.innerHTML = "";
    };
  }, [symbol]);

  return (
    <div className="tradingview-widget-container" ref={containerRef}></div>
  );
}

export default SimpleChart;
