import { useTokenLookup } from "../../../../../hooks/useMarket";
import { formatAsset, formatDateTime, formatPrice } from "../../../../../lib/format";

const PLACEHOLDER_LOGO = "/favicon.ico";

/** " Bitcoin" o "$": el dolar se escribe pegado a la cifra. */
const assetLabel = (asset, name) => (asset === "USDT" ? "$" : ` ${name}`);

export default function TradeItem({ trade }) {
  const tokenOf = useTokenLookup();

  const isBuy = trade.side === "BUY";

  // La operacion ya trae que se ha pagado y que se ha recibido, asi que no hace
  // falta descomponer el simbolo del par para saberlo.
  const paidName = tokenOf(trade.paidAsset)?.name ?? trade.paidAsset;
  const receivedName = tokenOf(trade.receivedAsset)?.name ?? trade.receivedAsset;

  const baseLabel = ` ${isBuy ? receivedName : paidName}`;
  const quoteLabel = isBuy
    ? assetLabel(trade.paidAsset, paidName)
    : assetLabel(trade.receivedAsset, receivedName);
  // La comision se cobra siempre sobre lo que se entrega.
  const feeLabel = assetLabel(trade.paidAsset, paidName);

  const drawCoin = (asset) => (
    <div>
      <img
        style={{ width: "35px", height: "35px" }}
        src={tokenOf(asset)?.logo ?? PLACEHOLDER_LOGO}
        alt={"Logo de " + asset}
      />
    </div>
  );

  const textBuy = (
    <>
      Has{" "}
      <span className="fw-bold">
        comprado {formatAsset(trade.receivedAmount)}
        {baseLabel}
      </span>{" "}
      por{" "}
      <span className="fw-bold">
        {formatAsset(trade.paidAmount)}
        {quoteLabel}
      </span>
    </>
  );

  const textSell = (
    <>
      Has{" "}
      <span className="fw-bold">
        vendido {formatAsset(trade.paidAmount)}
        {baseLabel}
      </span>{" "}
      por{" "}
      <span className="fw-bold">
        {formatAsset(trade.receivedAmount)}
        {quoteLabel}
      </span>
    </>
  );

  return (
    <li className="list-group-item px-0">
      <div className="row align-items-center">
        <div className="d-flex col-lg-9 d-flex align-items-start mb-3 mb-lg-0 flex-column">
          <div className="d-flex align-items-center">
            <div className="d-flex justify-content-start align-items-center">
              {drawCoin(trade.paidAsset)}
              <i
                className="bi bi-arrow-right text-dark mx-2"
                style={{ fontSize: "1em" }}
              ></i>
              {drawCoin(trade.receivedAsset)}
            </div>
          </div>
          <div>{isBuy ? textBuy : textSell}</div>
          <div
            className="d-flex flex-row text-secondary flex-lg-row flex-column"
            style={{ fontSize: "0.9em" }}
          >
            <span>
              Precio: {formatPrice(trade.price)}
              {quoteLabel}&nbsp;&nbsp;
            </span>
            <span>
              Comisión: {formatAsset(trade.fee)}
              {feeLabel}
            </span>
          </div>
        </div>
        <div className="col-lg-3 d-flex flex-column align-items-center align-items-lg-end">
          <span
            className={`fw-bold ${isBuy ? "text-success" : "text-danger"}`}
          >
            {isBuy ? "COMPRA" : "VENTA"}
          </span>
          <span
            className="text-secondary text-end"
            style={{ fontSize: "0.9em" }}
          >
            {formatDateTime(trade.executedAt)}
          </span>
        </div>
      </div>
    </li>
  );
}
