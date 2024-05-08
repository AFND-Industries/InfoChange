import { useEffect, useState, useMemo } from "react";
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
  const [symbolCoin, setSymbolCoin] = useState(1);
  const [dollar, setDollar] = useState(symbolCoin * coin.price);

  useEffect(() => {
    const popoverTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl);
    });

    // Cleanup popovers when component unmounts
    return () => {
      popoverList.map((popover) => popover.dispose());
    };
  }, []);

  const goBack = () => {
    navigate("/coins");
  };

  const symbolOverview = useMemo(
    () => (
      <SymbolOverview
        colorTheme="light"
        symbols={[coin.symbol + "USDT"]}
        chartType="area"
        downColor="#800080"
        borderDownColor="#800080"
        wickDownColor="#800080"
        chartOnly="true"
      />
    ),
    [coin.symbol]
  );

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
        <div className="col mx-1 ">
          <SingleTicker
            symbol={coin.symbol + "USDT"}
            width="100%"
          ></SingleTicker>

          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col">
                  <span className="text-secondary">
                    Volumen de Mercado 24H{" "}
                  </span>
                  <i
                    className="bi bi-info-circle"
                    data-bs-toggle="popover"
                    data-bs-placement="bottom"
                    data-bs-trigger="hover focus"
                    data-bs-content="Una medida del volumen de operaciones de criptomonedas en todas las plataformas rastreadas en las últimas 24 horas. Esto se rastrea las 24 horas del día sin horarios de apertura ni cierre."
                  ></i>
                </div>
                <div className="col d-flex justify-content-end">
                  <span className="text-dark">
                    <strong>{"$" + coin.volume}</strong>
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <span className="text-secondary"> Precio más alto </span>
                  <i
                    className="bi bi-info-circle"
                    data-bs-toggle="popover"
                    data-bs-placement="bottom"
                    data-bs-trigger="hover focus"
                    data-bs-content="El precio más alto que alcanzó la criptomoneda en las últimas 24 horas."
                  ></i>
                </div>
                <div className="col d-flex justify-content-end">
                  <span className="text-dark">
                    <strong>{"$" + coin.high_price}</strong>
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <span className="text-secondary"> Precio más bajo </span>
                  <i
                    className="bi bi-info-circle"
                    data-bs-toggle="popover"
                    data-bs-placement="bottom"
                    data-bs-trigger="hover focus"
                    data-bs-content="El precio más bajo que alcanzó la criptomoneda en las últimas 24 horas."
                  ></i>
                </div>
                <div className="col d-flex justify-content-end">
                  <span className="text-dark">
                    <strong>{"$" + coin.low_price}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="my-4">
            <h5 className="text-secondary">
              <strong className="text-dark"> {coin.symbol} Converter </strong>
              <span style={{ fontSize: "17px" }}>
                a {Number(coin.price).toFixed(3)} el {coin.symbol}
              </span>
            </h5>
          </div>
          <div className="row">
            <div className="input-group input-group-lg d-flex align-items-start mb-3">
              <input
                type="text"
                className="form-control h-100"
                value={symbolCoin}
                placeholder={symbolCoin}
                onChange={(e) => {
                  setSymbolCoin(e.target.value);
                  setDollar(e.target.value * coin.price);
                }}
              />
              <span className="input-group-text">{coin.symbol}&nbsp;</span>
            </div>
            <div className="input-group input-group-lg d-flex align-items-start mb-3">
              <input
                type="text"
                className="form-control"
                value={dollar}
                placeholder={dollar}
                onChange={(e) => {
                  setDollar(e.target.value);
                  setSymbolCoin(e.target.value / coin.price);
                }}
              />
              <span className="input-group-text">USD</span>
            </div>
          </div>
        </div>

        <div className="col mx-1 w-50 h-100">
          <div className="row">{symbolOverview}</div>
        </div>
      </div>

      <div className="m-4 h-100">
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
  );
}
