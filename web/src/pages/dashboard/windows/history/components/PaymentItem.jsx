import { formatDateTime, formatUsd } from "../../../../../lib/format";

const drawLogo = (logo, width, name) => (
  <img
    src={logo}
    className="rounded rounded-5 me-2"
    style={{ width, height: "50px" }}
    alt={"Logo de " + name}
  />
);

/**
 * El medio de pago ya no es "CREDIT o PayPal": llega como `CARD`, `IBAN` o
 * `PAYPAL`, y el servidor guarda solo una referencia enmascarada.
 */
const METHODS = {
  CARD: {
    logo: () => drawLogo("/credit.png", "70px", "Mastercard"),
    deposit: (
      <>
        {" "}
        con una <span className="fw-bold">tarjeta de crédito</span>
      </>
    ),
    withdrawal: (
      <>
        {" "}
        a una <span className="fw-bold">tarjeta de crédito</span>
      </>
    ),
  },
  PAYPAL: {
    logo: () => drawLogo("/paypal.png", "100px", "PayPal"),
    deposit: (
      <>
        {" "}
        mediante <span className="fw-bold">PayPal</span>
      </>
    ),
    withdrawal: (
      <>
        {" "}
        a <span className="fw-bold">PayPal</span>
      </>
    ),
  },
  IBAN: {
    logo: () => (
      <i
        className="bi bi-bank me-2"
        style={{ fontSize: "2.5rem", lineHeight: "50px" }}
        aria-hidden="true"
      ></i>
    ),
    deposit: (
      <>
        {" "}
        mediante <span className="fw-bold">transferencia bancaria</span>
      </>
    ),
    withdrawal: (
      <>
        {" "}
        a una <span className="fw-bold">cuenta bancaria</span>
      </>
    ),
  },
};

export default function PaymentItem({ payment }) {
  const isDeposit = payment.kind === "DEPOSIT";
  const method = METHODS[payment.method];

  const text = (
    <>
      <span>
        Has{" "}
        <span className="fw-bold">{isDeposit ? "añadido" : "retirado"}</span>{" "}
        {isDeposit ? "saldo" : "dinero"}{" "}
      </span>
      <span>{method ? (isDeposit ? method.deposit : method.withdrawal) : null}</span>
    </>
  );

  return (
    <li className="list-group-item px-0">
      <div className="row align-items-center">
        <div className="d-flex col-lg-9 d-flex align-items-start mb-3 mb-lg-0 flex-column">
          <div className="d-flex flex-row">
            <div className="d-flex align-items-center">
              {method ? method.logo() : null}
            </div>
          </div>
          <div>{text}</div>
          <div
            className="d-flex flex-row text-secondary flex-lg-row flex-column"
            style={{ fontSize: "0.9em" }}
          >
            <span>
              Información de la operación: {payment.methodReference ?? "-"}
            </span>
          </div>
        </div>
        <div className="col-lg-3 d-flex flex-column align-items-center align-items-lg-end">
          <span
            className={`fw-bold ${isDeposit ? "text-success" : "text-danger"}`}
          >
            {isDeposit ? "+" : "-"}
            {formatUsd(payment.amount)}
          </span>
          <span
            className="text-secondary text-end"
            style={{ fontSize: "0.9em" }}
          >
            {formatDateTime(payment.createdAt)}
          </span>
        </div>
      </div>
    </li>
  );
}
