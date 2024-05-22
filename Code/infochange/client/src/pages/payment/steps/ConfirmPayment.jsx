import { CreditCard, Paypal } from "react-bootstrap-icons";

export default function ConfirmPayment(props) {
    const { cart, data, nextHandler, backHandler } = props;

    const li_classes = "list-group-item d-flex justify-content-between";

    if (cart.type !== "USDT")
        return buyProduct(cart, data, backHandler, nextHandler);
    return (
        <>
            <h6>Resumen de la compra</h6>
            <div className="container">
                <ul className="list-group mb-2">
                    <li className={li_classes}>
                        <span>Saldo a añadir</span>
                        <b>{cart.quantity} $</b>
                    </li>
                    {payMethod(data)}
                </ul>
                <p>
                    Al pulsar <i>Pagar</i> aceptas los{" "}
                    <span className="text-primary">Términos de Servicio</span> y
                    las <span className="text-primary">Condiciones de Uso</span>{" "}
                    de InfoPay.
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
                        <button
                            className="btn btn-primary w-100"
                            onClick={nextHandler}
                        >
                            Pagar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function buyProduct(cart, data, backHandler, nextHandler) {
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
                    <span className="text-primary">Términos de Servicio</span> y
                    las <span className="text-primary">Condiciones de Uso</span>{" "}
                    de InfoPay.
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
                        <button
                            className="btn btn-primary w-100"
                            onClick={nextHandler}
                        >
                            Pagar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function payMethod(data) {
    const li_classes = "list-group-item d-flex justify-content-between";

    if (data.type === "paypal")
        return (
            <>
                <li className={li_classes}>
                    <span>Método de pago</span>
                    <b>
                        Paypal <Paypal />
                    </b>
                </li>
                <li className={li_classes}>
                    <span>Cuenta asociada</span>
                    <b>{data.info.email}</b>
                </li>
            </>
        );
    else if (data.type === "credit") {
        const card = data.info.cardNumber;
        return (
            <>
                <li className={li_classes}>
                    <span>Método de pago</span>
                    <b>
                        Tarjeta de crédito <CreditCard />
                    </b>
                </li>
                <li className={li_classes}>
                    <span>Número de tarjeta</span>
                    <b>
                        {"".padStart(card.length - 4, "*")}
                        {card.slice(card.length - 4)}
                    </b>
                </li>
            </>
        );
    }
}
