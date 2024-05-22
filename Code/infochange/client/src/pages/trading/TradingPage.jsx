import React from 'react';
import SymbolSearch from './components/SymbolSearch';
import RotatingMarquee from './components/RotatingMarquee';
import BuyAndSell from './components/BuyAndSell';
import TradingChart from './components/TradingChart';
import { useTrading } from './context/TradingContext';
import JustCloseModal from './components/JustCloseModal';
import TradeConfirmationModal from './components/TradeConfirmationModal';
import TradeToast from './components/TradeToast';
import "./TradingPage.css";

function TradingPage() {
  const { changeChartMode, getTradingMode, getActualPair } = useTrading();
  const tradingMode = getTradingMode();

  if (tradingMode === 0 && getActualPair().quoteAsset !== "USDT") // Por si entra a un par de modo pro
    changeChartMode();

  return (
    <>
      <TradeConfirmationModal />
      <JustCloseModal />

      <RotatingMarquee display={tradingMode === 1} floatingBottom={true} />

      <div className="container mt-2 mb-5 d-flex flex-column">
        <div className="row">
          <div className="col ps-0">
            <button className="btn btn-primary mt-2 mb-2" onClick={changeChartMode}>
              Cambiar modo
            </button>
          </div>
        </div>
        <div className="row">
          <main className="col-lg-9 ps-0 pe-lg-2 pe-0 chart-resize">
            <TradingChart style={tradingMode} />
          </main>
          <aside className="col-lg-3">
            <SymbolSearch style={tradingMode} />
          </aside>
        </div>
        <section className="row" style={{ marginTop: "10px" }}>
          <BuyAndSell style={tradingMode} />
        </section>
      </div>
      <TradeToast />
    </>
  );
}

export default TradingPage;
