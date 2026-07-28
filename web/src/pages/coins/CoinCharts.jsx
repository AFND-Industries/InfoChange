import { memo, useRef, useState } from "react";
import { SymbolOverview, Timeline } from "react-ts-tradingview-widgets";

/**
 * Los widgets de TradingView vuelven a inyectar su script cada vez que cambian
 * sus props, y estas son objetos nuevos en cada render. Aislarlos detras de
 * `memo` evita que se recarguen cada vez que llega un precio nuevo.
 */
const PriceChart = memo(function PriceChart({ symbol }) {
  return (
    <SymbolOverview
      colorTheme="light"
      symbols={[symbol]}
      chartType="area"
      downColor="#800080"
      borderDownColor="#800080"
      wickDownColor="#800080"
      chartOnly="true"
      width={"100%"}
    />
  );
});

const NewsTimeline = memo(function NewsTimeline({ symbol }) {
  return (
    <Timeline
      colorTheme="light"
      feedMode="symbol"
      market="crypto"
      symbol={symbol}
      locale="es"
      height={600}
      width="100%"
    />
  );
});

/**
 * Grafico y noticias, con el indice que resalta la seccion visible.
 *
 * La version anterior localizaba la columna con `document.querySelector`,
 * registraba un `scroll` con throttle propio y saltaba de seccion con
 * `getElementById(...).scrollIntoView()`.
 */
export default function CoinCharts({ asset, isSmallScreen }) {
  const chartRef = useRef(null);
  const newsRef = useRef(null);
  const [activeSection, setActiveSection] = useState("one");

  const onScroll = (event) => {
    const container = event.currentTarget;
    const news = newsRef.current;
    if (!news) return;

    const offset =
      news.getBoundingClientRect().top - container.getBoundingClientRect().top;
    setActiveSection(offset <= container.clientHeight / 2 ? "two" : "one");
  };

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <aside
      className="col-lg-8"
      onScroll={onScroll}
      style={{
        overflowY: isSmallScreen ? "visible" : "auto",
        maxHeight: isSmallScreen ? "" : "68vh",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: "0",
          zIndex: "1",
          backgroundColor: "white",
        }}
      >
        <div className={isSmallScreen ? "d-none" : ""}>
          <div className="bs-docs-sidebar">
            <ul
              className="nav nav-underline flex-row "
              style={{ position: "sticky", top: "0", zIndex: "1" }}
            >
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${activeSection === "one" ? "active" : ""}`}
                  onClick={() => scrollTo(chartRef)}
                >
                  Gráfico
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${activeSection === "two" ? "active" : ""}`}
                  onClick={() => scrollTo(newsRef)}
                >
                  Noticias
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <section id="one" ref={chartRef}>
        <h2 className={isSmallScreen ? "h3 my-4" : "d-none"}>Gráfico</h2>
        <PriceChart symbol={`${asset}USDT`} />
      </section>
      <br />
      <section id="two" ref={newsRef}>
        <h2>Noticias</h2>
        <div className="row my-4 mx-1">
          <NewsTimeline symbol={`${asset}USD`} />
        </div>
      </section>
    </aside>
  );
}
