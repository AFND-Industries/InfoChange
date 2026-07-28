import { useEffect, useRef } from "react";

const WIDGET_SRC =
  "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";

function SimpleChart({ symbol }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container === null) return undefined;

    const script = document.createElement("script");
    script.src = WIDGET_SRC;
    script.type = "text/javascript";
    script.async = true;
    // El widget lee su configuracion del texto del <script>. Antes se escribia
    // con `innerHTML`, que interpreta marcado; `textContent` deja el JSON tal
    // cual, que es lo unico que hace falta.
    script.textContent = JSON.stringify({
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
    container.appendChild(script);

    // El widget cuelga su iframe del mismo contenedor, asi que al desmontar hay
    // que vaciarlo entero.
    return () => {
      while (container.firstChild !== null) {
        container.removeChild(container.firstChild);
      }
    };
  }, [symbol]);

  return (
    <div className="tradingview-widget-container" ref={containerRef}></div>
  );
}

export default SimpleChart;
