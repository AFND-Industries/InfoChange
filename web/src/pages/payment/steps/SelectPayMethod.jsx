/**
 * Primer paso: elegir medio. Al ingresar saldo se paga con tarjeta y al
 * retirarlo se cobra en una cuenta bancaria; PayPal sirve para ambos.
 */
export default function SelectPayMethod({ action, onSelect }) {
  const isDeposit = action === "in";

  return (
    <div>
      <h3 className="fs-6">
        Seleccione el método de {isDeposit ? "pago" : "ingreso"}
      </h3>
      <div className="container">
        <button
          type="button"
          className="card clickableCard w-100 align-items-center py-3 mb-3"
          onClick={() => onSelect(isDeposit ? "CARD" : "IBAN")}
        >
          <h4 className="card-title">
            {isDeposit ? "Tarjeta de crédito" : "Cuenta bancaria"}
          </h4>
          <i
            className={"bi bi-" + (isDeposit ? "credit-card" : "bank")}
            style={{ color: "#383d3b", fontSize: "3ch" }}
          ></i>
        </button>
        <button
          type="button"
          className="card clickableCard border-primary text-primary w-100 align-items-center py-3"
          onClick={() => onSelect("PAYPAL")}
        >
          <h4 className="card-title">Paypal</h4>
          <i className="bi bi-paypal"></i>
        </button>
      </div>
    </div>
  );
}
