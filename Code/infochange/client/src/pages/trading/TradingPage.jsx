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
      <div id="loading-screen" style={{ display: "none" }}>
        <div className="loading-screen d-flex justify-content-center align-items-center">
          <div className="spinner-border" style={{ width: "100px", height: "100px" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>

      <TradeConfirmationModal />
      <JustCloseModal />

      <RotatingMarquee display={tradingMode == 1} floatingBottom={true} />

      <div className="container mt-2 mb-5 d-flex flex-column">
        <div className="row">
          <div className="col ps-0">
            <button className="btn btn-primary mt-2 mb-2" onClick={changeChartMode}>Cambiar modo</button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-9 ps-0">
            <TradingChart style={tradingMode} />
          </div>
          <div className="col-md-3">
            <SymbolSearch style={tradingMode} />
          </div>
        </div>
        <div className="row" style={{ marginTop: "10px" }}>
          <BuyAndSell style={tradingMode} />
        </div>
      </div>

      <TradeToast />
    </>
  );
}

export default TradingPage;