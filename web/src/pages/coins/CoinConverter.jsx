import { useState } from "react";

import { formatPrice } from "../../lib/format";

/** Valor para un `input type="number"`: sin notacion cientifica ni ceros de relleno. */
const toInputValue = (value, decimals) => String(Number(value.toFixed(decimals)));

/** Conversor entre el activo y dolares al precio de mercado. */
export default function CoinConverter({ asset, price }) {
  const [amount, setAmount] = useState("");
  const [dollars, setDollars] = useState("");

  const hasPrice = Number.isFinite(price) && price > 0;

  const onAmountChange = (value) => {
    setAmount(value);
    setDollars(hasPrice && value !== "" ? toInputValue(Number(value) * price, 2) : "");
  };

  const onDollarsChange = (value) => {
    setDollars(value);
    setAmount(hasPrice && value !== "" ? toInputValue(Number(value) / price, 8) : "");
  };

  return (
    <>
      <div className="row my-4">
        <span className=" h5 text-secondary">
          <strong className="text-dark"> {asset} Converter </strong>
          <span style={{ fontSize: "17px" }}>
            a {hasPrice ? formatPrice(price) : "-"} el {asset}
          </span>
        </span>
      </div>
      <div className="row">
        <div className="input-group input-group-lg d-flex align-items-start mb-3">
          <input
            type="number"
            className="form-control h-100"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            disabled={!hasPrice}
            aria-label="Cantidad de moneda seleccionada a convertir en dólares"
          />
          <span className="input-group-text">{asset}&nbsp;</span>
        </div>
        <div className="input-group input-group-lg d-flex align-items-start mb-3">
          <input
            type="number"
            className="form-control"
            value={dollars}
            onChange={(event) => onDollarsChange(event.target.value)}
            disabled={!hasPrice}
            aria-label="Cantidad de Dólares a convertir en la moneda seleccionada"
          />
          <span className="input-group-text">USD</span>
        </div>
      </div>
    </>
  );
}
