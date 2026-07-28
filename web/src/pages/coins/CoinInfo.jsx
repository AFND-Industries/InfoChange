import { memo } from "react";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SingleTicker } from "react-ts-tradingview-widgets";

import {
  useCoins,
  usePairPrice,
  useTokenDetails,
  useTokenLookup,
  useTokens,
} from "../../hooks/useMarket";
import CoinCharts from "./CoinCharts";
import CoinConverter from "./CoinConverter";
import CoinLinks from "./CoinLinks";
import CoinStats from "./CoinStats";
import CoinTags from "./CoinTags";
import { useIsSmallScreen } from "./useIsSmallScreen";

import "./UrlsCards.css";

/** Ver el comentario de `CoinCharts`: el widget se recarga con cada prop nueva. */
const Ticker = memo(function Ticker({ symbol }) {
  return <SingleTicker symbol={symbol} width="100%" locale="es" />;
});

function Loading({ label }) {
  return (
    <div className="d-flex justify-content-center py-3">
      <Spinner animation="border" size="sm" role="status" variant="primary">
        <span className="visually-hidden">{label}</span>
      </Spinner>
    </div>
  );
}

/**
 * Ficha de un activo. Antes recibia por props la fila completa de la tabla, asi
 * que al recargar la pagina o entrar por el enlace directo no habia datos y la
 * pantalla se cerraba sola; ahora todo se resuelve a partir de la ruta.
 */
export default function CoinInfo() {
  const { symbol = "" } = useParams();
  const asset = symbol.toUpperCase();
  const pairSymbol = `${asset}USDT`;

  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();

  // `useTokens` comparte consulta con `useTokenLookup`; aqui solo se consulta su
  // estado para distinguir "todavia cargando" de "el activo no existe".
  const tokensQuery = useTokens();
  const token = useTokenLookup()(asset);

  const coinsQuery = useCoins();
  const detailsQuery = useTokenDetails();

  const ticker = coinsQuery.data?.coins.find((coin) => coin.symbol === pairSymbol);
  const details = detailsQuery.data?.[asset];
  const livePrice = usePairPrice(pairSymbol);
  const lastPrice = livePrice ?? Number(ticker?.price);

  if (tokensQuery.isPending) {
    return <Loading label="Cargando la información de la moneda..." />;
  }

  if (tokensQuery.error) {
    return (
      <Alert variant="danger" className="m-3">
        {tokensQuery.error.message}
      </Alert>
    );
  }

  if (!token) {
    return (
      <Alert variant="warning" className="m-3">
        <Alert.Heading>No conocemos la moneda {asset}</Alert.Heading>
        <Link to="/coins">Volver al listado de monedas</Link>
      </Alert>
    );
  }

  /** Los detalles largos se piden aparte, asi que tienen su propio estado. */
  const withDetails = (content) => {
    if (detailsQuery.isPending) return <Loading label="Cargando los detalles..." />;
    if (detailsQuery.error) {
      return (
        <span className="text-secondary small">{detailsQuery.error.message}</span>
      );
    }
    return content;
  };

  return (
    <div
      className="container-fluid mt-2 mb-5 d-flex flex-column"
      id="container-coin-info"
    >
      <section className="row mx-3 ">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center text-secondary">
            <Link to="/coins" className="text-secondary">
              <u> Monedas </u> &ensp;
            </Link>
            <i className="bi bi-chevron-right" aria-hidden="true" /> &ensp;
            <span className="text-dark">{token.name}</span>
          </div>
        </div>
        <h1
          className="text-center mt-0 mb-2"
          style={{ fontSize: "2em", fontWeight: "700", letterSpacing: "1px" }}
        >
          {" "}
          Información sobre {token.name}
        </h1>
      </section>

      <div className="row mx-3 mt-4">
        <div className="col-lg-4">
          <div style={{ position: "sticky", top: "0", zIndex: "1" }}>
            <Ticker symbol={pairSymbol} />
          </div>

          <div className="card">
            <div
              className="scroll card-body"
              style={{
                overflowY: isSmallScreen ? "visible" : "auto",
                maxHeight: isSmallScreen ? "" : "55vh",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {coinsQuery.error ? (
                <Alert variant="danger">{coinsQuery.error.message}</Alert>
              ) : null}

              <CoinStats ticker={ticker} lastPrice={lastPrice} />

              <div className="row mb-2">
                <div className="col">
                  <span>
                    <strong> Enlaces </strong>{" "}
                  </span>
                  <div className="row my-2">
                    {withDetails(<CoinLinks urls={details?.urls} />)}
                  </div>
                </div>
              </div>

              <div className="row mb-2">
                <div className="col">
                  <span>
                    <strong> Para comprar la moneda {token.name}: </strong>{" "}
                  </span>
                  <div className="row my-2 mx-1">
                    <button
                      className="btn btn-success"
                      onClick={() => navigate(`/trading/${pairSymbol}`)}
                      aria-label="Ir a la página de compra de la moneda seleccionada"
                    >
                      Compra aquí
                    </button>
                  </div>
                </div>
              </div>

              <CoinConverter asset={asset} price={lastPrice} />

              <div className="row my-2">
                <div className="col">
                  <span>
                    <strong>Etiquetas</strong>
                  </span>
                  <div className="row my-2">
                    {withDetails(<CoinTags name={token.name} tags={details?.tags} />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CoinCharts asset={asset} isSmallScreen={isSmallScreen} />
      </div>
    </div>
  );
}
