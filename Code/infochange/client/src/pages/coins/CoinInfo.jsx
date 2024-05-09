import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FundamentalData } from "react-ts-tradingview-widgets";
import { SymbolInfo } from "react-ts-tradingview-widgets";
import { MiniChart } from "react-ts-tradingview-widgets";
import { Timeline } from "react-ts-tradingview-widgets";
import { SymbolOverview } from "react-ts-tradingview-widgets";
import { SingleTicker } from "react-ts-tradingview-widgets";
import { useCoins } from "./CoinsAPI";

export default function CoinInfo(props) {
  const { coin, key } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const [symbolCoin, setSymbolCoin] = useState(1);
  const { doGetCoinPrice } = useCoins();
  const [price, setPrice] = useState("");

  const logos = [
    "bi bi-browser-edge",
    "bi bi-twitter-x",
    "bi bi-envelope-fill",
    "bi bi-chat",
    "bi bi-facebook",
    "bi bi-info-square-fill",
    "bi bi-reddit",
    "bi bi-file-earmark",
    "bi bi-github",
    "bi bi-megaphone-fill",
  ];

  const nombres = [
    "Sitio Web",
    "Twitter",
    "Mensajes",
    "Chat",
    "Facebook",
    "Info",
    "Reddit",
    "Docs",
    "Github",
    "Anuncios",
  ];

  const fetchPrice = async () => {
    const priceGet = await doGetCoinPrice(coin.symbol + "USDT");
    setPrice(priceGet.data.price);
  };

  useEffect(() => {
    if (coin.length === 0) {
      console.log("Coin is undefined");
      goBack();
    }
    const popoverTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl);
    });

    fetchPrice();
    const interval = setInterval(async () => {
      fetchPrice();
    }, 10000);

    // Cleanup popovers when component unmounts
    return () => {
      popoverList.map((popover) => popover.dispose());
      clearInterval(interval);
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
        width={"100%"}
      />
    ),
    [coin.symbol]
  );

  const renderUrls = () => {
    if (coin.urls === undefined) return null;
    return Object.keys(coin.urls).map((key, index) => {
      if (coin.urls[key].length > 0) {
        const url = coin.urls[key][0];
        return (
          <div className="col-4 mb-1" key={key}>
            <a
              className="btn btn-light col d-flex align-items-center"
              style={{
                maxWidth: "18rem",
                maxHeight: "5rem",
                backgroundColor: "#f8f9fa",
              }}
              href={url}
            >
              <div className="col-auto mx-1">
                <i className={logos[index]}></i>
              </div>
              <div className="col d-flex align-items-center">
                {" "}
                {/* Añade las clases d-flex y align-items-center */}
                <p className="fs-6 text-dark m-0">{nombres[index]}</p>{" "}
                {/* Añade m-0 para eliminar el margen */}
              </div>
            </a>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div
      className="container-fluid mt-2 mb-5 d-flex flex-column"
      key={location.key}
    >
      <div className="row mb-4 mx-3 text-secondary">
        <div className="col-12">
          <span style={{ cursor: "pointer" }} onClick={goBack}>
            Monedas &ensp;
          </span>
          <i class="bi bi-chevron-right"></i> &ensp;
          <span className="text-dark">{coin.name}</span>
        </div>
      </div>
      <div className="row mx-3">
        <div
          className="col-lg-4"
          style={{
            overflowY: "auto",
            maxHeight: "600px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div style={{ position: "sticky", top: "0", zIndex: "1" }}>
            <SingleTicker
              symbol={coin.symbol + "USDT"}
              width="100%"
            ></SingleTicker>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="row mb-2">
                <div className="col">
                  <span className="text-secondary">
                    Capitalización Mercado{" "}
                  </span>
                  <i
                    className="bi bi-info-circle"
                    data-bs-toggle="popover"
                    data-bs-placement="bottom"
                    data-bs-trigger="hover focus"
                    data-bs-content={
                      "El valor total de mercado de la oferta circulante de una criptomoneda Es similar a la capitalización de flotación libre en el mercado de valores.\n\n" +
                      "Capitalización de mercado = Precio de la moneda x Suministro circulante."
                    }
                  ></i>
                </div>
                <div className="col d-flex justify-content-end">
                  <span className="text-dark">
                    <strong>
                      {"$" +
                        (Number(coin.volume * price) / 1000000).toFixed(4) +
                        "M"}
                    </strong>
                  </span>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col">
                  <span className="text-secondary">Volumen Mercado 24H </span>
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
                    <strong>{"$" + Number(coin.volume).toFixed(3)}</strong>
                  </span>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col">
                  <span className="text-secondary">
                    Volumen/Capitalización(24H){" "}
                  </span>
                  <i
                    className="bi bi-info-circle"
                    data-bs-toggle="popover"
                    data-bs-placement="bottom"
                    data-bs-trigger="hover focus"
                    data-bs-content="Indicador de liquidez. Cuanto mayor sea la proporción, más líquida es la criptomoneda, lo que debería facilitar su compra/venta en una bolsa cercana a su valor.
                    Las criptomonedas con una proporción baja son menos líquidas y lo más probable es que presenten mercados menos estables."
                  ></i>
                </div>
                <div className="col d-flex justify-content-end">
                  <span className="text-dark">
                    <strong>{"$" + Number(coin.volume).toFixed(3)}</strong>
                  </span>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col">
                  <span className="text-secondary"> Precio más alto(24H) </span>
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
                    <strong>{"$" + Number(coin.high_price).toFixed(3)}</strong>
                  </span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <span className="text-secondary"> Precio más bajo(24H) </span>
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
                    <strong>{"$" + Number(coin.low_price).toFixed(3)}</strong>
                  </span>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col">
                  <span>
                    <strong> Enlaces </strong>{" "}
                  </span>
                  <div className="row my-2">{renderUrls()}</div>
                </div>
              </div>
              <div className="row my-4">
                <h5 className="text-secondary">
                  <strong className="text-dark">
                    {" "}
                    {coin.symbol} Converter{" "}
                  </strong>
                  <span style={{ fontSize: "17px" }}>
                    a {Number(price).toFixed(3)} el {coin.symbol}
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
                      setDollar(e.target.value * price);
                    }}
                  />
                  <span className="input-group-text">{coin.symbol}&nbsp;</span>
                </div>
                <div className="input-group input-group-lg d-flex align-items-start mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={price}
                    placeholder={price}
                    onChange={(e) => {
                      setDollar(e.target.value);
                      setSymbolCoin(e.target.value / price);
                    }}
                  />
                  <span className="input-group-text">USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-lg-8"
          style={{
            overflowY: "auto",
            maxHeight: "800px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {symbolOverview}
        </div>
      </div>
    </div>
  );
}
