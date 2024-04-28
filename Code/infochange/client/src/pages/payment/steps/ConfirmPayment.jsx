export default function ConfirmPayment(props) {
  const { cart, data, nextHandler, backHandler } = props;

  if (cart.type !== "USD") return buyProduct(cart, data);
  return (
    <>
      <h6>Resumen de la compra</h6>
      <div className="container">
        <table className="table">
          <tbody>
            <tr>
              <td colSpan="3">Saldo a añadir</td>
              <td>
                <b>{cart.quantity} $</b>
              </td>
            </tr>
          </tbody>
        </table>
        {payMethod(data)}
        <p>
          Al pulsar <i>Pagar</i> aceptas los{" "}
          <span className="text-primary">Términos de Servicio</span> y las{" "}
          <span className="text-primary">Condiciones de Uso</span> de InfoPay.
        </p>

        <div className="alert alert-warning">
          <div className="alert-heading">
            <h5>ADVERTENCIA</h5>
          </div>
          Esta compra <b>NO ES REMBOLSABLE</b>
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
            <button className="btn btn-primary w-100" onClick={nextHandler}>
              Pagar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function buyProduct(cart, data) {
  return (
    <div>
      <h6>Resumen de la compra</h6>
      <div className="container">
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{cart.type}</td>
              <td>{cart.quantity}</td>
              <td>{cart.price} $</td>
              <td>{cart.price * cart.quantity}</td>
            </tr>
            <tr>
              <td colSpan="3">
                <b>TOTAL</b>
              </td>
              <td>
                <b>{cart.price * cart.quantity} $</b>
              </td>
            </tr>
          </tbody>
        </table>
        {payMethod(data)}
        <p>
          Al pulsar <i>Pagar</i> aceptas los{" "}
          <span className="text-primary">Términos de Servicio</span> y las{" "}
          <span className="text-primary">Condiciones de Uso</span>
          de InfoPay.
        </p>
        <div className="alert alert-warning">
          <div className="alert-heading">
            <h5>ADVERTENCIA</h5>
          </div>
          Esta compra <b>NO ES REMBOLSABLE</b>
        </div>
      </div>
    </div>
  );
}

function payMethod(data) {
  if (data.type === "paypal")
    return (
      <>
        <div className="row">
          <div className="col-md-3 col-6">
            <b>Método de pago</b>
          </div>
          <div className="col-md-9 col-6">Paypal</div>
        </div>
        <div className="row mb-2">
          <div className="col-md-3 col-6">
            <b>Cuenta asociada</b>
          </div>
          <div className="col-md-9 col-6">{data.info.email}</div>
        </div>
      </>
    );
  else if (data.type === "credit") {
    const card = data.info.cardNumber;
    return (
      <>
        <div className="row">
          <div className="col-md-3 col-6">Método de pago</div>
          <div className="col-md-9 col-6 fw-bold">Tarjeta de crédito</div>
        </div>
        <div className="row mb-2">
          <div className="col-md-3 col-6">Número de tarjeta</div>
          <div className="col-md-9 col-6 fw-bold">
            {"".padStart(card.length - 4, "*")}
            {card.slice(card.length - 4)}
          </div>
        </div>
      </>
    );
  }
}
