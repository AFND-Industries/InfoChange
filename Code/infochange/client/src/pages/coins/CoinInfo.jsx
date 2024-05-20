import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FundamentalData } from "react-ts-tradingview-widgets";
import { SymbolInfo } from "react-ts-tradingview-widgets";
import { MiniChart } from "react-ts-tradingview-widgets";
import { Timeline } from "react-ts-tradingview-widgets";
import { SymbolOverview } from "react-ts-tradingview-widgets";
import { SingleTicker } from "react-ts-tradingview-widgets";
import { useCoins } from "./CoinsAPI";
import Modal from "react-bootstrap/Modal";

import "./UrlsCards.css";
import { Button } from "primereact/button";

export default function CoinInfo(props) {
  const { coin, key } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const [symbolCoin, setSymbolCoin] = useState();
  const { doGetCoinPrice } = useCoins();
  const [price, setPrice] = useState("");
  const [dollar, setDollar] = useState();
  const [showModal, setShowModal] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 990);

  const logos = [
    "bi bi-globe2",
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

    const throttle = (callback, delay = 16) => {
      let lastCall = 0;
      return function (...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
          return;
        }
        lastCall = now;
        callback(...args);
      };
    };

    const handleScroll = () => {
      const columnElement = document.querySelector(".col-lg-8");
      const scrollPosition = columnElement.scrollTop;
      const sections = document.querySelectorAll(".col-lg-8 > section");

      let activeSection = null;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionMid = sectionTop + sectionHeight / 2;

        if (
          scrollPosition >= sectionTop - sectionTop / 3 &&
          scrollPosition < sectionMid + sectionHeight / 2
        ) {
          activeSection = section;
        }
      });

      if (activeSection) {
        setActiveNavItem(activeSection.id);
      }
    };

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 990);
      if (window.innerWidth < 990) {
        const columnElement = document.querySelector(".col-lg-8");
        columnElement.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("resize", handleResize);

    const throttledScrollHandler = throttle(handleScroll);

    const columnElement = document.querySelector(".col-lg-8");
    columnElement.addEventListener("scroll", throttledScrollHandler);

    fetchPrice();
    const interval = setInterval(async () => {
      fetchPrice();
    }, 10000);

    // Cleanup popovers when component unmounts
    return () => {
      popoverList.map((popover) => popover.dispose());
      clearInterval(interval);
      columnElement.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (showModal) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }
  }, [showModal]);

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
              className="btn btn-light col d-flex align-items-center url-card"
              style={{
                maxWidth: "18rem",
                maxHeight: "5rem",
                backgroundColor: "#f8f9fa",
              }}
              href={url}
            >
              <div className="col-auto mx-1 d-flex justify-content-center align-items-center">
                <i className={`url-icon ${logos[index]}`}></i>
              </div>
              <div className="col d-flex align-items-center">
                <p className="fs-6 text-dark m-0 url-name">{nombres[index]}</p>
              </div>
            </a>
          </div>
        );
      }
      return null;
    });
  };

  const showModalFront = () => {
    return (
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{coin.name + " etiquetas"}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
        >
          <div className="row my-2">{showAllTags()}</div>
        </Modal.Body>
      </Modal>
    );
  };

  const showAllTags = () => {
    return coin.tags.map((tag, index) => {
      return (
        <div className="col m-1" key={index}>
          <a
            className="btn btn-light col d-flex align-items-center justify-content-center url-card"
            style={{
              backgroundColor: "#f8f9fa",
              whiteSpace: "nowrap",
            }}
          >
            {tag}
          </a>
        </div>
      );
    });
  };

  const renderEtiquetas = () => {
    if (coin.tags === null || coin.tags === undefined || coin.tags.length === 0)
      return null;
    if (coin.tags.length <= 3) {
      return coin.tags.map((tag, index) => {
        return (
          <div className="col mb-1" key={index}>
            <a
              className="btn btn-light col d-flex align-items-center justify-content-center url-card"
              style={{
                maxWidth: "18rem",
                maxHeight: "5rem",
                backgroundColor: "#f8f9fa",
                whiteSpace: "nowrap",
              }}
            >
              {tag}
            </a>
          </div>
        );
      });
    }
    if (coin.tags.length > 3) {
      const firstThree = coin.tags.slice(0, 4);
      return firstThree.map((tag, index) => {
        if (index === 3)
          return (
            <div
              className="col"
              key={index}
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setShowModal(true);
                }
              }}
            >
              <a
                className="btn col d-flex align-items-center justify-content-center url-card fs-6"
                style={{
                  maxWidth: "18rem",
                  maxHeight: "5rem",
                  color: "blue",
                  whiteSpace: "nowrap",
                }}
                onClick={() => setShowModal(true)}
              >
                <strong>Ver todo</strong>
              </a>
              {showModalFront()}
            </div>
          );
        else
          return (
            <div className="col" key={index}>
              <a
                className="btn btn-light col d-flex align-items-center justify-content-center url-card fs-6"
                style={{
                  maxWidth: "10rem",
                  maxHeight: "5rem",
                  backgroundColor: "#f8f9fa",
                }}
              >
                {tag}
              </a>
            </div>
          );
      });
    }
  };

  const onClickTrading = () => {
    navigate("/trading/" + coin.symbol + "USDT");
  };

  return (
    <div
      className="container-fluid mt-2 mb-5 d-flex flex-column"
      key={location.key}
      id="container-coin-info"
    >
      <div className="row mb-4 mx-3 text-secondary">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span
              style={{ cursor: "pointer" }}
              onClick={goBack}
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  goBack();
                }
              }}
            >
              Monedas &ensp;
            </span>
            <i class="bi bi-chevron-right"></i> &ensp;
            <span className="text-dark">{coin.name}</span>
          </div>
        </div>
      </div>
      <div className="row mx-3">
        <div className="col-lg-4">
          <div style={{ position: "sticky", top: "0", zIndex: "1" }}>
            <SingleTicker
              symbol={coin.symbol + "USDT"}
              width="100%"
            ></SingleTicker>
          </div>

          <div className="card">
            <div
              className="scroll card-body"
              style={{
                overflowY: isSmallScreen ? "visible" : "auto",
                maxHeight: isSmallScreen ? "" : "475px",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
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
              <div className="row mb-2">
                <div className="col">
                  <span>
                    <strong> Para comprar la moneda {coin.name}: </strong>{" "}
                  </span>
                  <div className="row my-2 mx-1">
                    <button
                      className="btn btn-success"
                      onClick={onClickTrading}
                    >
                      Compra aquí
                    </button>
                  </div>
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
                    type="number"
                    className="form-control h-100"
                    value={symbolCoin}
                    placeholder={symbolCoin}
                    onChange={(e) => {
                      setSymbolCoin(e.target.value);
                      setDollar(e.target.value * price);
                    }}
                    aria-label="Cantidad de moneda seleccionada a convertir en dólares"
                  />
                  <span className="input-group-text">{coin.symbol}&nbsp;</span>
                </div>
                <div className="input-group input-group-lg d-flex align-items-start mb-3">
                  <input
                    type="number"
                    className="form-control"
                    value={dollar}
                    placeholder={dollar}
                    onChange={(e) => {
                      setDollar(e.target.value);
                      setSymbolCoin(e.target.value / price);
                    }}
                    aria-label="Cantidad de Dólares a convertir en la moneda seleccionada"
                  />
                  <span className="input-group-text">USD</span>
                </div>
              </div>
              <div className="row my-2">
                <div className="col">
                  <span>
                    <strong>Etiquetas</strong>
                  </span>
                  <div className="row my-2">{renderEtiquetas()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-lg-8"
          style={{
            overflowY: isSmallScreen ? "visible" : "auto",
            maxHeight: isSmallScreen ? "" : "600px",
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
            <div
              className={isSmallScreen ? "d-none" : ""}
              data-bs-spy="scroll"
              data-bs-target=".bs-docs-sidebar"
            >
              <div className="bs-docs-sidebar">
                <ul
                  className="nav nav-underline flex-row "
                  style={{ position: "sticky", top: "0", zIndex: "1" }}
                >
                  <li className={`nav-item`}>
                    <a
                      className={`nav-link ${
                        (activeNavItem === "one" || activeNavItem === "") &&
                        "active"
                      }`}
                      href="javascript:void(0)"
                      onClick={(event) => {
                        document
                          .getElementById("one")
                          .scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Gráfico
                    </a>
                  </li>
                  <li className={`nav-item `}>
                    <a
                      className={`nav-link ${
                        activeNavItem === "two" && "active"
                      }`}
                      href="javascript:void(0)"
                      onClick={(event) => {
                        document
                          .getElementById("two")
                          .scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Noticias
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <section id="one">
            <h3 className={isSmallScreen ? "my-4" : "d-none"}>Gráfico</h3>
            {symbolOverview}
          </section>
          <br></br>
          <section id="two">
            <h3>Noticias</h3>
            <div className="row my-4 mx-1">
              <Timeline
                colorTheme="light"
                feedMode="symbol"
                market="crypto"
                symbol={coin.symbol + "USD"}
                locale="es"
                height={600}
                width="100%"
              ></Timeline>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
