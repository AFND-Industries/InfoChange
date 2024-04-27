import React from 'react';

import SymbolSearch from './components/SymbolSearch';
import RotatingMarquee from './components/RotatingMarquee';

import BuyAndSell from './components/BuyAndSell';
import TradingChart from './components/TradingChart';
import { useTrading } from './context/TradingContext';
import JustCloseModal from './components/JustCloseModal';

import "./TradingPage.css";

function TradingPage() {
  const { changeChartMode } = useTrading();

  return (
    <>
      <JustCloseModal />
      <RotatingMarquee />
      <div className="container mt-2 mb-5 d-flex flex-column">
        <div className="row">
          <div className="col ps-0">
            <button className="btn btn-primary mt-2 mb-2" onClick={changeChartMode}>Cambiar modo</button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-9 ps-0">
            <TradingChart />
          </div>
          <div className="col-md-3">
            <SymbolSearch />
          </div>
        </div>
        <div className="row" style={{ marginTop: "10px" }}>
          <BuyAndSell />
        </div>
      </div>
    </>
  );
}

export default TradingPage;