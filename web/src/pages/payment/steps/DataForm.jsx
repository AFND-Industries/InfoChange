import { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { InfoCircle } from "react-bootstrap-icons";

const INCOMPLETE =
  "Debe rellenar todos los campos del formulario para continuar con el pago";

/**
 * Formularios del medio de pago. Lo que recogen viaja al servidor como union
 * discriminada:
 *
 *   { type: "CARD",   holder, number, expiry: "MM/AA", cvv }
 *   { type: "IBAN",   holder, iban }
 *   { type: "PAYPAL", email }
 *
 * El servidor valida lo mismo y solo guarda una referencia enmascarada, asi que
 * ni el numero completo, ni el CVV, ni ninguna contrasena llegan a la base de
 * datos. Aqui se valida antes de enviar para dar respuesta inmediata.
 */
function SimulatorNotice() {
  return (
    <p className="form-text">
      InfoPay es un simulador con fines educativos: no se realiza ningún cobro
      real. Los datos introducidos no se almacenan; del medio de pago solo se
      conserva una referencia enmascarada, como los cuatro últimos dígitos.
    </p>
  );
}

function FormShell({ title, error, onSubmit, onBack, children }) {
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <h3 className="fs-6">{title}</h3>
      <div className="container">
        {children}
        <SimulatorNotice />
        {error ? (
          <div className="alert alert-danger" role="alert">
            <p className="mb-0">{error}</p>
          </div>
        ) : null}
        <div className="row">
          <div className="col mb-3">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={onBack}
            >
              Volver
            </button>
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary w-100">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

/** "2027-05" (input de tipo month) -> "05/27" (lo que espera la API). */
function toApiExpiry(value) {
  const [year, month] = value.split("-");
  return `${month}/${year.slice(-2)}`;
}

function toMonthInput(expiry) {
  if (!expiry) return "";
  const [month, year] = expiry.split("/");
  return `20${year}-${month}`;
}

export function CardForm({ method, onSubmit, onBack }) {
  const [holder, setHolder] = useState(method.holder ?? "");
  const [number, setNumber] = useState(method.number ?? "");
  const [expiry, setExpiry] = useState(toMonthInput(method.expiry));
  const [cvv, setCvv] = useState(method.cvv ?? "");
  const [error, setError] = useState("");

  const submit = () => {
    // El servidor tolera espacios y guiones, asi que se limpian antes de validar.
    const digits = number.replace(/[\s-]/g, "");

    if (!holder.trim() || !digits || !expiry || !cvv.trim()) {
      setError(INCOMPLETE);
      return;
    }
    if (!/^\d{13,19}$/.test(digits)) {
      setError("El número de tarjeta debe tener entre 13 y 19 dígitos.");
      return;
    }
    if (!/^\d{3,4}$/.test(cvv.trim())) {
      setError("El código de seguridad debe tener 3 o 4 dígitos.");
      return;
    }
    if (expiry < new Date().toISOString().slice(0, 7)) {
      setError("La tarjeta está caducada.");
      return;
    }

    setError("");
    onSubmit({
      type: "CARD",
      holder: holder.trim(),
      number: digits,
      expiry: toApiExpiry(expiry),
      cvv: cvv.trim(),
    });
  };

  return (
    <FormShell
      title="Introduzca los datos de la tarjeta"
      error={error}
      onSubmit={submit}
      onBack={onBack}
    >
      <div className="mb-3">
        <label htmlFor="holderInput" className="form-label">
          Titular de la tarjeta
        </label>
        <input
          id="holderInput"
          type="text"
          autoComplete="cc-name"
          value={holder}
          onChange={(event) => setHolder(event.target.value)}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="cardInput" className="form-label">
          Número de tarjeta
        </label>
        <input
          id="cardInput"
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          maxLength={19}
          value={number}
          onChange={(event) => setNumber(event.target.value)}
          className="form-control"
        />
      </div>
      <div className="row g-3">
        <div className="col-md-6 col-12">
          <label htmlFor="dateInput" className="form-label">
            Fecha de expiración
          </label>
          <input
            id="dateInput"
            type="month"
            autoComplete="cc-exp"
            value={expiry}
            onChange={(event) => setExpiry(event.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-md-6 col-12">
          <div className="mb-3">
            <label htmlFor="cvvInput" className="form-label">
              Código de Seguridad{" "}
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip>
                    El código de seguridad es un código de 3 dígitos que se
                    encuentra en el reverso de la tarjeta de crédito
                  </Tooltip>
                }
              >
                <span
                  className="d-inline-block"
                  tabIndex={0}
                  role="button"
                  aria-label="Qué es el código de seguridad"
                >
                  <InfoCircle />
                </span>
              </OverlayTrigger>
            </label>
            <input
              id="cvvInput"
              type="text"
              inputMode="numeric"
              autoComplete="cc-csc"
              maxLength={4}
              value={cvv}
              onChange={(event) => setCvv(event.target.value)}
              className="form-control"
            />
          </div>
        </div>
      </div>
    </FormShell>
  );
}

export function IbanForm({ method, onSubmit, onBack }) {
  const [holder, setHolder] = useState(method.holder ?? "");
  const [iban, setIban] = useState(method.iban ?? "");
  const [error, setError] = useState("");

  const submit = () => {
    const normalized = iban.replace(/\s/g, "").toUpperCase();

    if (!holder.trim() || !normalized) {
      setError(INCOMPLETE);
      return;
    }
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(normalized)) {
      setError("El IBAN no tiene un formato válido. Ejemplo: ES9121000418450200051332");
      return;
    }

    setError("");
    onSubmit({ type: "IBAN", holder: holder.trim(), iban: normalized });
  };

  return (
    <FormShell
      title="Introduzca los datos de su cuenta bancaria"
      error={error}
      onSubmit={submit}
      onBack={onBack}
    >
      <div className="mb-3">
        <label htmlFor="ownerInput" className="form-label">
          Titular de la cuenta
        </label>
        <input
          id="ownerInput"
          type="text"
          autoComplete="name"
          value={holder}
          onChange={(event) => setHolder(event.target.value)}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="ibanInput" className="form-label">
          IBAN de la cuenta
        </label>
        <input
          id="ibanInput"
          type="text"
          value={iban}
          onChange={(event) => setIban(event.target.value)}
          className="form-control"
        />
      </div>
    </FormShell>
  );
}

export function PaypalForm({ method, onSubmit, onBack }) {
  const [email, setEmail] = useState(method.email ?? "");
  const [error, setError] = useState("");

  const submit = () => {
    const normalized = email.trim().toLowerCase();

    if (!normalized) {
      setError(INCOMPLETE);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setError("Introduzca una dirección de correo válida.");
      return;
    }

    setError("");
    onSubmit({ type: "PAYPAL", email: normalized });
  };

  return (
    <FormShell
      title="Introduzca los datos de su cuenta de Paypal"
      error={error}
      onSubmit={submit}
      onBack={onBack}
    >
      <div className="mb-3 py-1">
        <label htmlFor="emailInput" className="form-label">
          Correo Electrónico
        </label>
        <input
          id="emailInput"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="form-control"
        />
      </div>
    </FormShell>
  );
}
