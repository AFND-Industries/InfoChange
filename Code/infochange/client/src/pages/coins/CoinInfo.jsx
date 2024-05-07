import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FundamentalData } from "react-ts-tradingview-widgets";
import { SymbolInfo } from "react-ts-tradingview-widgets";
import { MiniChart } from "react-ts-tradingview-widgets";
import { Timeline } from "react-ts-tradingview-widgets";
import { SymbolOverview } from "react-ts-tradingview-widgets";

export default function CoinInfo(props) {
  const { coin, key } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    navigate("/coins");
  };

  return (
    <div key={location.key} style={{ overflowX: "hidden" }}>
      <div className="row d-flex justify-content-between m-3">
        <div className="col-md-6 d-flex justify-content-start">
          <button className="btn btn-outline-primary" onClick={goBack}>
            <i className="bi bi-chevron-left me-2"></i>
            <span className="d-sm-inline d-none">Volver</span>
          </button>
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          <button className="btn btn-outline-primary" onClick={goBack}>
            <i className="bi bi-chevron-left me-2"></i>
            <span className="d-sm-inline d-none">Volver</span>
          </button>
        </div>
      </div>
      <div className="row d-flex m-3 ">
        <div className="col mx-1 h-100">
          <SymbolInfo
            colorTheme="light"
            symbol={coin.symbol}
            locale="es"
            largeChartUrl="true"
            width="100%"
            height="100%"
          ></SymbolInfo>
          <p
            className="text-center mt-2 mb-2 p-3"
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "15px",
              fontSize: "1.2em",
            }}
          >
            {coin.description}
          </p>
        </div>
        <div className="col mx-1 h-100">
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
