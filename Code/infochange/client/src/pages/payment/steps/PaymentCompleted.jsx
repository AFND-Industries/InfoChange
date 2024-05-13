import { CheckLg } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

export default function PaymentCompleted(props) {
    const { cart, feedback } = props;

    return feedback === "OK" ? paymentSuccess(cart) : paymentFailed(feedback);
}

const paymentSuccess = (cart) => (
    <>
        <h6>Pago completado</h6>
        <div className="container">
            <div className="row">
                <div className="col-12 text-center">
                    <CheckLg style={{ fontSize: "32px" }} />
                    <h4>¡Pago completado con éxito!</h4>
                </div>
            </div>
            <div class="alert alert-success" role="alert">
                {cart.type !== "USDT"
                    ? `Se ha${
                          cart.quantity !== 1 ? "n" : ""
                      } añadido correctamente ${cart.quantity} ${
                          cart.type
                      } a tu cartera por ${cart.price * cart.quantity} $.`
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
    </>
);

const paymentFailed = (feedback) => (
    <>
        <h6>No se pudo completar el pago</h6>
        <div className="container">
            <div className="row">
                <div className="col-12 text-center">
                    <CheckLg style={{ fontSize: "32px" }} />
                    <h4>Ha ocurrido un error :(</h4>
                </div>
            </div>
            <div class="alert alert-danger" role="alert">
                <p>
                    No se ha podido completar el pago por el siguiente motivo:{" "}
                    {feedback}
                </p>
                <p>Inténtelo de nuevo más tarde</p>
            </div>
            <div className="text-center">
                <Link to="/" className="btn btn-primary">
                    Volver al menú
                </Link>
            </div>
        </div>
    </>
);
