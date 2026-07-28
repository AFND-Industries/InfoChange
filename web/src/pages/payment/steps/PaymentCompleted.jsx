import { CheckLg } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

import { formatUsd } from "../../../lib/format";

/**
 * Solo se llega aqui cuando la operacion ha terminado bien. Un fallo se muestra
 * en el paso anterior, con el mensaje del servidor y la posibilidad de
 * reintentar, en vez de dejar al usuario en una pantalla sin salida.
 */
export default function PaymentCompleted({ cart }) {
  const isDeposit = cart.action === "in";
  const plural = Number(cart.amount) !== 1 ? "n" : "";

  return (
    <>
      <h3 className="fs-6">{isDeposit ? "Pago" : "Ingreso"} completado</h3>
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <CheckLg style={{ fontSize: "32px" }} />
            <h4>¡{isDeposit ? "Pago" : "Ingreso"} completado con éxito!</h4>
          </div>
        </div>
        <div className="alert alert-success" role="alert">
          {isDeposit
            ? `Se ha${plural} añadido ${formatUsd(cart.amount)} a tu saldo.`
            : `Se ha${plural} retirado ${formatUsd(cart.amount)} de tu saldo.`}
        </div>
        <div className="text-center">
          <Link to="/dashboard" className="btn btn-primary">
            Volver al panel de control
          </Link>
        </div>
      </div>
    </>
  );
}
