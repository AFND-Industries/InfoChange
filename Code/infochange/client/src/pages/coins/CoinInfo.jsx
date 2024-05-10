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

export default function CoinInfo(props) {
  const { coin, key } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const [symbolCoin, setSymbolCoin] = useState(1);
  const { doGetCoinPrice } = useCoins();
  const [price, setPrice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("");

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

    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const scrollPosition = document.querySelector(".col-lg-8").scrollTop;
      console.log(activeNavItem);

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveNavItem(section.id);
        }
      });
    };

    const columnElement = document.querySelector(".col-lg-8");
    columnElement.addEventListener("scroll", handleScroll);

    window.addEventListener("scroll", handleScroll);

    fetchPrice();
    const interval = setInterval(async () => {
      fetchPrice();
    }, 10000);

    // Cleanup popovers when component unmounts
    return () => {
      popoverList.map((popover) => popover.dispose());
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
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
              <div className="col-auto mx-1">
                <i className={`url-icon ${logos[index]}`}></i>
              </div>
              <div className="col d-flex align-items-center">
                {" "}
                <p className="fs-6 text-dark m-0 url-name">
                  {nombres[index]}
                </p>{" "}
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
          <Modal.Title>{coin.name + "etiquetas"}</Modal.Title>
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
    if (coin.tags === undefined) return null;
    if (coin.tags.length === 0) return null;
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
            <div className="col" key={index}>
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

  return (
    <div
      className="container-fluid mt-2 mb-5 d-flex flex-column"
      key={location.key}
      id="container-coin-info"
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
        <div className="col-lg-4">
          <div style={{ position: "sticky", top: "0", zIndex: "1" }}>
            <SingleTicker
              symbol={coin.symbol + "USDT"}
              width="100%"
            ></SingleTicker>
          </div>

          <div className="card">
            <div
              className="card-body"
              style={{
                overflowY: "auto",
                maxHeight: "600px",
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
            overflowY: "auto",
            maxHeight: "600px",
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
            <div data-bs-spy="scroll" data-bs-target=".bs-docs-sidebar">
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
                      href="#one"
                    >
                      Gráfico
                    </a>
                  </li>
                  <li className={`nav-item `}>
                    <a
                      className={`nav-link ${
                        activeNavItem === "two" && "active"
                      }`}
                      href="#two"
                    >
                      Mercado
                    </a>
                  </li>
                  <li className={`nav-item `}>
                    <a
                      className={`nav-link ${
                        activeNavItem === "three" && "active"
                      }`}
                      href="#three"
                    >
                      Noticias
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <section id="one">{symbolOverview}</section>
          <br></br>
          <section id="two">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae et
            laboriosam beatae ducimus laudantium error aspernatur dolore
            impedit, quas labore eligendi molestias eaque recusandae consequatur
            fugiat exercitationem asperiores magnam eos! Lorem ipsum dolor sit,
            amet consectetur adipisicing elit. Nobis dolor velit reprehenderit!
            Hic maiores in quaerat quasi soluta nulla aut consequatur. Eligendi
            provident delectus, voluptatibus error voluptatum harum eum
            doloremque. Lorem ipsum dolor, sit amet consectetur adipisicing
            elit. Cumque, corrupti molestiae sed voluptatem optio vitae nostrum
            ab dolorum commodi, rem excepturi beatae praesentium consequuntur
            voluptate sunt possimus. Natus, numquam deserunt. Lorem ipsum dolor
            sit amet consectetur adipisicing elit. Perspiciatis eius cupiditate
            pariatur ab, fuga commodi. Quo omnis aliquam deleniti blanditiis! In
            quo incidunt asperiores sit nisi ea. Optio, nisi omnis? Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Sunt recusandae atque
            architecto ut laborum amet accusantium similique voluptatum deserunt
            eos, aut, provident quaerat iure? Rem quis reiciendis repudiandae
            commodi necessitatibus. Lorem ipsum dolor sit amet consectetur,
            adipisicing elit. Atque minima exercitationem, voluptatibus ab cum
            obcaecati et numquam dolores excepturi temporibus nam, dolor, quasi
            iste tempora reiciendis dolore quae rerum voluptates? Lorem, ipsum
            dolor sit amet consectetur adipisicing elit. Facere esse minus
            eveniet, laudantium cum facilis placeat aliquam dolores rerum iure?
            Sunt, saepe laboriosam? Corrupti officia quas voluptatem, reiciendis
            illum alias. Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Dolorem, magnam recusandae. Hic eveniet sit neque. Omnis sint
            ipsam, iusto laudantium et assumenda, placeat doloremque vitae cum
            dolorem sed minus quasi? Lorem ipsum dolor sit, amet consectetur
            adipisicing elit. Facere delectus eveniet quas minus animi. Maxime,
            obcaecati voluptatem quis iusto perferendis id nemo similique porro
            cumque eum unde, quibusdam, perspiciatis illum. Lorem ipsum dolor
            sit amet consectetur adipisicing elit. Quidem nobis reprehenderit,
            sed ut quasi aliquid accusamus necessitatibus exercitationem
            repudiandae magni neque dicta sequi beatae omnis, in molestias
            incidunt nisi quos! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Earum doloremque, iste exercitationem asperiores
            quia quisquam magni eaque ea, vitae debitis quas quo quibusdam
            obcaecati quam corporis. Quaerat ipsam modi accusamus. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Placeat saepe voluptas
            deserunt eos nobis minima exercitationem ea explicabo dolor! Vel
            rerum aperiam, aliquid officiis ullam perspiciatis pariatur
            architecto quibusdam quas. Lorem, ipsum dolor sit amet consectetur
            adipisicing elit. Ratione praesentium, accusamus rem dolore tempore
            eligendi quo ea, magni placeat laudantium vel dolor exercitationem
            et, quis incidunt enim. Nobis, tempora omnis? Lorem ipsum dolor sit
            amet consectetur, adipisicing elit. Laudantium soluta cum optio ad
            cumque quaerat, numquam recusandae id voluptatum, perferendis earum
            omnis odit dignissimos ratione atque dolore veniam. Quidem, aperiam!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia,
            harum quam architecto aliquid incidunt doloremque suscipit culpa
            autem alias! Est distinctio maxime commodi tenetur veritatis. Optio
            assumenda harum sequi sint! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Sint, iure? Voluptatum id, consectetur excepturi
            eaque, distinctio autem fuga magni, suscipit beatae deleniti impedit
            optio est et deserunt rerum laboriosam ipsa. Lorem ipsum dolor sit
            amet consectetur, adipisicing elit. Tempore, corporis! Consequatur
            provident enim soluta exercitationem voluptatibus officiis numquam
            aperiam ratione quibusdam optio. Molestiae, officiis. Veniam laborum
            tenetur nihil officiis dolorem! Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Consequatur laboriosam esse reiciendis
            fugiat omnis at voluptatem cumque temporibus tempora, beatae
            delectus nulla odit autem corporis possimus vel libero corrupti
            vero? Lorem ipsum dolor sit amet consectetur adipisicing elit. Et
            tempore illo unde molestias repellendus, enim, totam placeat sint ut
            doloribus omnis. At esse a mollitia asperiores error itaque illum
            ipsum? Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Molestiae quos atque quam quas hic nulla consequuntur voluptatum ut
            vero, numquam architecto at maiores iusto ea adipisci unde voluptate
            impedit doloribus? Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Dolorem culpa minima alias. Eveniet porro nam hic
            atque adipisci tenetur delectus ullam ut quia unde, nihil libero
            facere dolor omnis sint? Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Minus ducimus consequuntur voluptatem, est at in
            reprehenderit voluptas consequatur nisi aliquid mollitia laborum
            ullam doloribus et molestiae sapiente corrupti blanditiis vel?
          </section>
          <br></br>
          <section id="three">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nobis
            dolor velit reprehenderit! Hic maiores in quaerat quasi soluta nulla
            aut consequatur. Eligendi provident delectus, voluptatibus error
            voluptatum harum eum doloremque. Lorem ipsum dolor, sit amet
            consectetur adipisicing elit. Cumque, corrupti molestiae sed
            voluptatem optio vitae nostrum ab dolorum commodi, rem excepturi
            beatae praesentium consequuntur voluptate sunt possimus. Natus,
            numquam deserunt. Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Perspiciatis eius cupiditate pariatur ab, fuga commodi. Quo
            omnis aliquam deleniti blanditiis! In quo incidunt asperiores sit
            nisi ea. Optio, nisi omnis? Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Sunt recusandae atque architecto ut laborum amet
            accusantium similique voluptatum deserunt eos, aut, provident
            quaerat iure? Rem quis reiciendis repudiandae commodi
            necessitatibus. Lorem ipsum dolor sit amet consectetur, adipisicing
            elit. Atque minima exercitationem, voluptatibus ab cum obcaecati et
            numquam dolores excepturi temporibus nam, dolor, quasi iste tempora
            reiciendis dolore quae rerum voluptates? Lorem, ipsum dolor sit amet
            consectetur adipisicing elit. Facere esse minus eveniet, laudantium
            cum facilis placeat aliquam dolores rerum iure? Sunt, saepe
            laboriosam? Corrupti officia quas voluptatem, reiciendis illum
            alias. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Dolorem, magnam recusandae. Hic eveniet sit neque. Omnis sint ipsam,
            iusto laudantium et assumenda, placeat doloremque vitae cum dolorem
            sed minus quasi? Lorem ipsum dolor sit, amet consectetur adipisicing
            elit. Facere delectus eveniet quas minus animi. Maxime, obcaecati
            voluptatem quis iusto perferendis id nemo similique porro cumque eum
            unde, quibusdam, perspiciatis illum. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Quidem nobis reprehenderit, sed ut
            quasi aliquid accusamus necessitatibus exercitationem repudiandae
            magni neque dicta sequi beatae omnis, in molestias incidunt nisi
            quos! Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum
            doloremque, iste exercitationem asperiores quia quisquam magni eaque
            ea, vitae debitis quas quo quibusdam obcaecati quam corporis.
            Quaerat ipsam modi accusamus. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Placeat saepe voluptas deserunt eos nobis minima
            exercitationem ea explicabo dolor! Vel rerum aperiam, aliquid
            officiis ullam perspiciatis pariatur architecto quibusdam quas.
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione
            praesentium, accusamus rem dolore tempore eligendi quo ea, magni
            placeat laudantium vel dolor exercitationem et, quis incidunt enim.
            Nobis, tempora omnis? Lorem ipsum dolor sit amet consectetur,
            adipisicing elit. Laudantium soluta cum optio ad cumque quaerat,
            numquam recusandae id voluptatum, perferendis earum omnis odit
            dignissimos ratione atque dolore veniam. Quidem, aperiam! Lorem
            ipsum dolor sit amet, consectetur adipisicing elit. Officia, harum
            quam architecto aliquid incidunt doloremque suscipit culpa autem
            alias! Est distinctio maxime commodi tenetur veritatis. Optio
            assumenda harum sequi sint! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Sint, iure? Voluptatum id, consectetur excepturi
            eaque, distinctio autem fuga magni, suscipit beatae deleniti impedit
            optio est et deserunt rerum laboriosam ipsa. Lorem ipsum dolor sit
            amet consectetur, adipisicing elit. Tempore, corporis! Consequatur
            provident enim soluta exercitationem voluptatibus officiis numquam
            aperiam ratione quibusdam optio. Molestiae, officiis. Veniam laborum
            tenetur nihil officiis dolorem! Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Consequatur laboriosam esse reiciendis
            fugiat omnis at voluptatem cumque temporibus tempora, beatae
            delectus nulla odit autem corporis possimus vel libero corrupti
            vero? Lorem ipsum dolor sit amet consectetur adipisicing elit. Et
            tempore illo unde molestias repellendus, enim, totam placeat sint ut
            doloribus omnis. At esse a mollitia asperiores error itaque illum
            ipsum? Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Molestiae quos atque quam quas hic nulla consequuntur voluptatum ut
            vero, numquam architecto at maiores iusto ea adipisci unde voluptate
            impedit doloribus? Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Dolorem culpa minima alias. Eveniet porro nam hic
            atque adipisci tenetur delectus ullam ut quia unde, nihil libero
            facere dolor omnis sint? Lorem{" "}
          </section>
        </div>
      </div>
    </div>
  );
}
