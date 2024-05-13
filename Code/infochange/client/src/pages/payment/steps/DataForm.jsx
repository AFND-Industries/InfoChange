import { useRef } from "react";

export function PaypalForm(props) {
  const { dataHandler, backHandler, data } = props;

  const email = useRef(null);
  const password = useRef(null);

  return (
    <div>
      <h6>Introduzca los datos de su cuenta de Paypal</h6>
      <div className="container">
        <div className="row mb-3">
          <div className="col-4">
            <label>Correo electrónico</label>
          </div>
          <div className="col-8">
            <input
              ref={email}
              type="text"
              defaultValue={data.info !== undefined ? data.info.email : ""}
              className="form-control"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-4">
            <label>Contraseña</label>
          </div>
          <div className="col-8">
            <input ref={password} type="password" className="form-control" />
          </div>
        </div>
        <div className="row">
          <div className="col mb-3">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={backHandler}
            >
              Volver
            </button>
          </div>
          <div className="col">
            <button
              className="btn btn-primary w-100"
              onClick={() =>
                dataHandler({
                  email: email.current.value,
                  password: password.current.value,
                })
              }
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export function CreditForm(props) {
  const { dataHandler, backHandler, data } = props;

  const creditCard = useRef(null);
  const expDate = useRef(null);
  const cvv = useRef(null);

  return (
    <div>
      <h6>Introduzca los datos de la tarjeta</h6>
      <div className="container">
        <div className="row mb-3">
          <div className="col-4">
            <label>Número de tarjeta</label>
          </div>
          <div className="col-8">
            <input
              ref={creditCard}
              type="text"
              defaultValue={data.info !== undefined ? data.info.cardNumber : ""}
              className="form-control"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-4">
            <label>Fecha de expiración</label>
          </div>
          <div className="col-md-8">
            <input
              ref={expDate}
              type="date"
              defaultValue={data.info !== undefined ? data.info.expDate : ""}
              className="form-control"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-4">
            <label>CVV (Presente en el reverso de la tarjeta)</label>
          </div>
          <div className="col-md-3">
            <input
              ref={cvv}
              type="number"
              maxLength={3}
              className="form-control"
            />
          </div>
        </div>
        <div className="row">
          <div className="col mb-3">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={backHandler}
            >
              Volver
            </button>
          </div>
          <div className="col">
            <button
              className="btn btn-primary w-100"
              onClick={() =>
                dataHandler({
                  cardNumber: creditCard.current.value,
                  expDate: expDate.current.value,
                  cvv: cvv.current.value,
                })
              }
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
