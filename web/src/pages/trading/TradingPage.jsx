import BuyAndSell from './components/BuyAndSell';
import RotatingMarquee from './components/RotatingMarquee';
import SymbolSearch from './components/SymbolSearch';
import TradingChart from './components/TradingChart';

import { useTrading } from './context/TradingContext';

import "./TradingPage.css";

function TradingPage() {
  const { pair, symbol, mode } = useTrading();

  const titleText = pair && mode === 0 ? (
    <span>Compra y vende <span className='fw-bold'>{pair.baseAssetName}</span></span>
  ) : (
    <span>Tradea <span className='fw-bold'>{pair ? pair.symbol : symbol}</span></span>
  );

  return (
    <>
      <h1 className="m-3 fs-1 text-center">{titleText}</h1>

      <RotatingMarquee display={mode === 1} floatingBottom={true} />

      <div className="container mt-2 mb-5 d-flex flex-column">
        <div className="row">
          <div className="col ps-0">

          </div>
        </div>
        <div className="row">
          <main className="col-lg-9 ps-0 pe-lg-2 pe-0 chart-resize">
            <TradingChart />
          </main>
          <aside className="col-lg-3">
            <SymbolSearch />
          </aside>
        </div>
        <section className="row" style={{ marginTop: "10px" }}>
          {/* Sin par no hay nada que comprar ni vender; el grafico ya avisa. */}
          {pair ? <BuyAndSell /> : null}
        </section>
      </div>
    </>
  );
}

export default TradingPage;
