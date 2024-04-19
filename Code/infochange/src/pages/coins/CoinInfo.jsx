import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FundamentalData } from "react-ts-tradingview-widgets";
import { SymbolInfo } from "react-ts-tradingview-widgets";
import { MiniChart } from "react-ts-tradingview-widgets";
import { Timeline } from "react-ts-tradingview-widgets";
import { SymbolOverview } from "react-ts-tradingview-widgets";

export default function CoinInfo(props) {
  const { coin } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    navigate("/coins");
  };

  return (
    <div key={location.key} style={{ overflowX: "hidden" }}>
      <div className="row m-3">
        <div className="col-md-6">
          <button className="btn btn-outline-primary" onClick={goBack}>
            <i className="bi bi-chevron-left me-2"></i>
            <span className="d-sm-inline d-none">Volver</span>
          </button>
        </div>
      </div>
      <div className="row d-flex m-3">
        <div className="col mx-1 ">
          <SymbolInfo
            colorTheme="light"
            symbol={coin.symbol}
            locale="es"
            largeChartUrl="true"
            width="100%"
            height="100%"
          ></SymbolInfo>
          <h6 className="text-center m-5">{coin.description}</h6>
        </div>
        <div className="col mx-1">
          <Timeline
            colorTheme="light"
            feedMode="symbol"
            market="crypto"
            symbol={coin.symbol + "USD"}
            locale="es"
            height={400}
            width="100%"
          ></Timeline>
        </div>
      </div>

      <div className="m-3">
        <SymbolOverview
          colorTheme="dark"
          symbols={[coin.symbol + "USDT"]}
          chartType="candlesticks"
          downColor="#800080"
          borderDownColor="#800080"
          wickDownColor="#800080"
          width="100%"
        />
      </div>
    </div>
  );
}
