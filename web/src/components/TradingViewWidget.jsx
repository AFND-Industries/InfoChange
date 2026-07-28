import { useEffect, useRef } from "react";

/** TradingView lee su configuracion del cuerpo del <script>, no de atributos. */
const WIDGET_CONFIG = {
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
};

/**
 * Miniatura de cotizacion de TradingView.
 *
 * La version anterior escribia la configuracion con `innerHTML` y nunca
 * retiraba el script al desmontar; como ademas se saltaba la creacion si ya
 * existia un script con ese id, al volver a la portada el hueco se quedaba
 * vacio. Aqui el contenido se pone con `textContent` y el contenedor se limpia
 * en el retorno del efecto, de modo que cada montaje parte de cero.
 */
export default function TradingViewWidget() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.textContent = JSON.stringify(WIDGET_CONFIG);

    container.appendChild(script);

    return () => {
      // TradingView cuelga su iframe del mismo contenedor, asi que se vacia
      // entero en lugar de retirar solo el script.
      container.replaceChildren();
    };
  }, []);

  return (
    <div className="tradingview-widget-container__widget" ref={containerRef} />
  );
}
