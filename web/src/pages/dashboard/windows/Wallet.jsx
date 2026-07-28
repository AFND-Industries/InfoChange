import { useState } from "react";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

import { usePriceLookup, useTokenLookup } from "../../../hooks/useMarket";
import { useSession } from "../../../hooks/useSession";
import { formatAsset, formatUsd, totalBalanceUsd } from "../../../lib/format";

const PLACEHOLDER_LOGO = "/favicon.ico";
const MAX_DEPOSIT = 1000000;

export default function Wallet() {
  const navigate = useNavigate();
  const { balances } = useSession();
  const priceOf = usePriceLookup();
  const tokenOf = useTokenLookup();

  const [amount, setAmount] = useState("");
  const [error, setError] = useState(undefined);

  const totalUsd = totalBalanceUsd(balances, priceOf);
  const btcPrice = priceOf("BTC");
  const totalBtc = btcPrice > 0 ? totalUsd / btcPrice : 0;

  const usdtBalance = Number(
    balances.find((balance) => balance.asset === "USDT")?.quantity ?? "0",
  );

  /** Lleva al formulario de pago con la cantidad ya introducida. */
  const goToPayment = (action) => {
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      setError(
        action === "in"
          ? "El saldo a añadir debe ser mayor que 0"
          : "El saldo a retirar debe ser mayor que 0",
      );
      return;
    }

    if (action === "in" && value >= MAX_DEPOSIT) {
      setError(
        "No puedes añadir tanto dinero. Prueba una cantidad menor a 1 millón de dólares",
      );
      setAmount("");
      return;
    }

    if (action === "out" && value > usdtBalance) {
      setError("No tienes suficiente saldo en la cuenta");
      setAmount("");
      return;
    }

    setError(undefined);
    setAmount("");
    // El importe viaja como cadena: es lo que espera `useDeposit`/`useWithdraw`.
    navigate("/payment", {
      state: { type: "USDT", quantity: amount.trim(), action },
    });
  };

  return (
    <>
      <div className="container d-flex flex-column align-items-center py-3">
        <div className="d-md-flex d-block align-items-center mb-3">
          <div className="d-flex flex-column me-md-5">
            <span className="text-secondary mb-0 h4">Balance de la cuenta:</span>
            <div className="d-flex align-items-end">
              <div className="mb-0 h1">{formatAsset(totalBtc)}</div>
              <div className="ms-1 mb-1 h5"> BTC</div>
            </div>
          </div>
          <div className="d-flex flex-column">
            <div className="text-secondary mb-0 h4">Valor estimado:</div>
            <div className="mb-0 h1">{formatUsd(totalUsd)}</div>
          </div>
        </div>
        <div className="row g-2">
          <div className="col-12">
            <label htmlFor="dollarInput">Cantidad de dinero:</label>
            <div className="input-group">
              <input
                type="number"
                id="dollarInput"
                className="form-control"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                // Antes se registraba un `window.onkeydown` global, que seguia
                // activo con la pestana de la cartera cerrada.
                onKeyDown={(event) => {
                  if (event.key === "Enter") goToPayment("in");
                }}
              />
              <span className="input-group-text">$</span>
            </div>
          </div>
          <div className="col-sm-6">
            <button
              type="button"
              className="btn btn-outline-danger d-flex align-items-center w-100"
              onClick={() => goToPayment("out")}
            >
              <DashCircle className="me-2" /> Retirar saldo
            </button>
          </div>
          <div className="col-sm-6">
            <button
              type="button"
              className="btn btn-success d-flex align-items-center w-100"
              onClick={() => goToPayment("in")}
            >
              <PlusCircle className="me-2" /> Añadir saldo
            </button>
          </div>
        </div>
        {error ? (
          <div className="alert alert-danger mt-3 mb-0 w-100 text-center">
            {error}
          </div>
        ) : undefined}
      </div>
      <hr className="mx-4 my-2" />
      <div className="mx-4">
        <h2 className="fs-4 text-center text-body-secondary mb-3">Tu cartera</h2>
        {balances.length === 0 ? (
          <h3 className="fs-5 text-center text-body-secondary mb-3">
            No tienes monedas
          </h3>
        ) : (
          <div className="row g-3 mb-3">
            {balances.map((balance) => (
              <div key={balance.asset} className="col-lg-4 col-md-6 col">
                <WalletAsset
                  balance={balance}
                  token={tokenOf(balance.asset)}
                  valueUsd={Number(balance.quantity) * priceOf(balance.asset)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/** Ficha de una posicion: nombre y logo del catalogo, contravalor en dolares. */
function WalletAsset({ balance, token, valueUsd }) {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const name = token?.name ?? balance.asset;
  const logo = logoFailed || !token?.logo ? PLACEHOLDER_LOGO : token.logo;

  return (
    <div className="card h-100">
      <div className="card-body">
        {!logoLoaded && (
          <img
            src={PLACEHOLDER_LOGO}
            alt="Loading coin..."
            width={"32px"}
            height={"32px"}
          />
        )}
        <img
          src={logo}
          className="card-img-top placeholder-glow"
          style={{
            width: "32px",
            height: "32px",
            display: logoLoaded ? "block" : "none",
          }}
          onLoad={() => setLogoLoaded(true)}
          onError={() => setLogoFailed(true)}
          alt={name}
        />
        <p className="card-text">{name}</p>
        <h3 className="fs-5 card-title mt-0 mb-1">
          {formatAsset(balance.quantity)} {balance.asset}
        </h3>
        <h4 className="fs-6 text-secondary">~{formatUsd(valueUsd)}</h4>
      </div>
    </div>
  );
}
