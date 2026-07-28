import { Bank, CreditCard, Paypal } from "react-bootstrap-icons";

import { formatUsd } from "../../../lib/format";

const LI_CLASSES = "list-group-item d-flex justify-content-between";

/** Mismo enmascarado que aplica el servidor al guardar la referencia. */
const maskCard = (number) => `**** **** **** ${number.slice(-4)}`;
const maskIban = (iban) => `${iban.slice(0, 4)} **** ${iban.slice(-4)}`;

export default function ConfirmPayment({
  cart,
  method,
  available,
  error,
  pending,
  onConfirm,
  onBack,
}) {
  const isDeposit = cart.action === "in";

  // Retirar mas de lo que hay no llega ni a salir: el servidor lo rechazaria
  // igualmente, pero asi el aviso es inmediato.
  const insufficient = !isDeposit && Number(available) < Number(cart.amount);

  return (
    <>
      <h3 className="fs-6">Resumen de{isDeposit ? " la compra" : "l ingreso"}</h3>
      <div className="container">
        <ul className="list-group mb-2">
          <li className={LI_CLASSES}>
            <span>Saldo a {isDeposit ? "añadir" : "retirar"}</span>
            <b>{formatUsd(cart.amount)}</b>
          </li>
          {!isDeposit ? (
            <li className={LI_CLASSES}>
              <span>Saldo disponible</span>
              <b>{formatUsd(available)}</b>
            </li>
          ) : null}
          <MethodRows method={method} isDeposit={isDeposit} />
        </ul>
        <p>
          Al pulsar <i>{isDeposit ? "Pagar" : "Retirar"}</i> aceptas los{" "}
          <span className="text-primary">Términos y Condiciones de Uso</span> de
          InfoPay.
        </p>

        <div className="alert alert-warning">
          <div className="alert-heading">
            <h4 className="fs-5">ADVERTENCIA</h4>
          </div>
          {isDeposit ? (
            <>
              Esta compra <b>NO ES REMBOLSABLE</b>
            </>
          ) : (
            <>
              Asegúrese de que <b>los datos introducidos son correctos</b> antes
              de continuar
            </>
          )}
        </div>

        {insufficient ? (
          <div className="alert alert-danger" role="alert">
            No tienes saldo suficiente para esta retirada.
          </div>
        ) : null}
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}

        <div className="row">
          <div className="col mb-3">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={onBack}
              disabled={pending}
            >
              Volver
            </button>
          </div>
          <div className="col">
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={onConfirm}
              disabled={pending || insufficient}
            >
              {isDeposit ? "Pagar" : "Retirar"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function MethodRows({ method, isDeposit }) {
  const label = `Método de ${isDeposit ? "pago" : "ingreso"}`;

  if (method.type === "PAYPAL")
    return (
      <>
        <li className={LI_CLASSES}>
          <span>{label}</span>
          <b>
            Paypal <Paypal />
          </b>
        </li>
        <li className={LI_CLASSES}>
          <span>Cuenta asociada</span>
          <b>{method.email}</b>
        </li>
      </>
    );

  if (method.type === "CARD")
    return (
      <>
        <li className={LI_CLASSES}>
          <span>{label}</span>
          <b>
            Tarjeta de crédito <CreditCard />
          </b>
        </li>
        <li className={LI_CLASSES}>
          <span>Titular de la tarjeta</span>
          <b>{method.holder}</b>
        </li>
        <li className={LI_CLASSES}>
          <span>Número de tarjeta</span>
          <b>{maskCard(method.number)}</b>
        </li>
      </>
    );

  return (
    <>
      <li className={LI_CLASSES}>
        <span>{label}</span>
        <b>
          Cuenta Bancaria <Bank />
        </b>
      </li>
      <li className={LI_CLASSES}>
        <span>IBAN</span>
        <b>{maskIban(method.iban)}</b>
      </li>
      <li className={LI_CLASSES}>
        <span>Titular de la cuenta</span>
        <b>{method.holder}</b>
      </li>
    </>
  );
}
