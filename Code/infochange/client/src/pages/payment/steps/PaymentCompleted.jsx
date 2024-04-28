import { CheckLg } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

export default function PaymentCompleted(props) {
  const { cart } = props;

  return (
    <div>
      <h6>Pago completado</h6>
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <CheckLg style={{ fontSize: "32px" }} />
            <h4>¡Pago completado con éxito!</h4>
          </div>
        </div>
        <div class="alert alert-success" role="alert">
          {cart.type !== "USD"
            ? `Se ha${cart.quantity !== 1 ? "n" : ""} añadido correctamente ${
                cart.quantity
              } ${cart.type} a tu cartera por <b>${
                cart.price * cart.quantity
              } $.`
            : `Se ha${cart.quantity !== 1 ? "n" : ""} añadido ${
                cart.quantity
              } $ a tu saldo.`}
        </div>
        <div className="text-center">
          <Link to="/" className="btn btn-primary">
            Volver al menú
          </Link>
        </div>
      </div>
    </div>
  );
}
