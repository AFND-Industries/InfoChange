export default function ConfirmPayment(props) {
  const { cart } = props;
  return (
    <div>
      <h6>Resumen de la compra</h6>
      <div className="container">
        <table className="table">
          <thead>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
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
