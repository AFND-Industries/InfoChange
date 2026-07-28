import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import { formatPrice, formatUsd } from "../../lib/format";

/**
 * Icono de ayuda con su explicacion.
 *
 * Antes cada icono llevaba los atributos `data-bs-*` y un `useEffect` recorria
 * el documento con `querySelectorAll` para instanciar `new bootstrap.Popover`
 * sobre cada uno; si el componente se desmontaba a destiempo, el popover se
 * quedaba huerfano en el DOM.
 */
function InfoHint({ label, children }) {
  return (
    <OverlayTrigger
      placement="bottom"
      trigger={["hover", "focus"]}
      overlay={
        <Popover>
          <Popover.Body style={{ whiteSpace: "pre-line" }}>{children}</Popover.Body>
        </Popover>
      }
    >
      <i
        className="bi bi-info-circle"
        tabIndex={0}
        role="button"
        aria-label={`Que significa ${label}`}
      />
    </OverlayTrigger>
  );
}

function StatRow({ label, hint, value }) {
  return (
    <div className="row mb-2">
      <div className="col">
        <span className="text-secondary">{label} </span>
        <InfoHint label={label}>{hint}</InfoHint>
      </div>
      <div className="col d-flex justify-content-end">
        <span className="text-dark">
          <strong>{value}</strong>
        </span>
      </div>
    </div>
  );
}

const usd = (value) => (Number.isFinite(value) ? formatUsd(value) : "-");
const price = (value) => (Number.isFinite(Number(value)) ? `${formatPrice(value)} USD` : "-");

/** Cifras de las ultimas 24 h. `ticker` puede faltar si el activo no cotiza en USDT. */
export default function CoinStats({ ticker, lastPrice }) {
  const volume = Number(ticker?.volume);
  const quoteVolume = Number(ticker?.quoteVolume);

  // La API no publica el suministro circulante, asi que se mantiene la
  // aproximacion de la version anterior: volumen negociado por precio actual.
  const capitalization = volume * Number(lastPrice);
  const liquidity = capitalization > 0 ? quoteVolume / capitalization : NaN;

  return (
    <>
      <StatRow
        label="Capitalización Mercado"
        hint={
          "El valor total de mercado de la oferta circulante de una criptomoneda Es similar a la capitalización de flotación libre en el mercado de valores.\n\n" +
          "Capitalización de mercado = Precio de la moneda x Suministro circulante."
        }
        value={usd(capitalization)}
      />
      <StatRow
        label="Volumen Mercado 24H"
        hint="Una medida del volumen de operaciones de criptomonedas en todas las plataformas rastreadas en las últimas 24 horas. Esto se rastrea las 24 horas del día sin horarios de apertura ni cierre."
        value={usd(quoteVolume)}
      />
      <StatRow
        label="Volumen/Capitalización(24H)"
        hint="Indicador de liquidez. Cuanto mayor sea la proporción, más líquida es la criptomoneda, lo que debería facilitar su compra/venta en una bolsa cercana a su valor. Las criptomonedas con una proporción baja son menos líquidas y lo más probable es que presenten mercados menos estables."
        value={Number.isFinite(liquidity) ? formatPrice(liquidity, 2) : "-"}
      />
      <StatRow
        label="Precio más alto(24H)"
        hint="El precio más alto que alcanzó la criptomoneda en las últimas 24 horas."
        value={price(ticker?.highPrice)}
      />
      <StatRow
        label="Precio más bajo(24H)"
        hint="El precio más bajo que alcanzó la criptomoneda en las últimas 24 horas."
        value={price(ticker?.lowPrice)}
      />
    </>
  );
}
