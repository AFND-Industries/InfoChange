import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FundamentalData } from "react-ts-tradingview-widgets";
import { SymbolInfo } from "react-ts-tradingview-widgets";
import { MiniChart } from "react-ts-tradingview-widgets";
import { Timeline } from "react-ts-tradingview-widgets";
import { SymbolOverview } from "react-ts-tradingview-widgets";
import { SingleTicker } from "react-ts-tradingview-widgets";

export default function CoinInfo(props) {
  const { coin, key } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    navigate("/coins");
  };

  return (
    <div key={location.key} style={{ overflowX: "hidden" }}>
      <div className="row my-4 mx-4 text-secondary">
        <div className="col">
          <span style={{ cursor: "pointer" }} onClick={goBack}>
            Monedas &ensp;
          </span>
          <i class="bi bi-chevron-right"></i> &ensp;
          <span className="text-dark">{coin.name}</span>
        </div>
      </div>
      <div className="row d-flex m-3 w-75">
        <div className="col mx-1 h-100">
          <SingleTicker
            symbol={coin.symbol + "USDT"}
            width="100%"
          ></SingleTicker>

          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col">
                  <span className="text-secondary">24 Hour Trading Vol </span>
                  <i class="bi bi-info-circle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col mx-1 h-100">
          <Timeline
            colorTheme="light"
            feedMode="symbol"
            market="crypto"
            symbol={coin.symbol + "USDT"}
            locale="es"
            height={400}
            width="100%"
          ></Timeline>
        </div>
      </div>

      <div className="m-3 h-100">
        <SymbolOverview
          colorTheme="light"
          symbols={[coin.symbol + "USDT"]}
          chartType="area"
          downColor="#800080"
          borderDownColor="#800080"
          wickDownColor="#800080"
          width="100%"
        />
      </div>
    </div>
  );
}
