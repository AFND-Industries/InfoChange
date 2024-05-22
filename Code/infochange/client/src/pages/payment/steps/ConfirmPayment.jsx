import { CreditCard, Paypal } from "react-bootstrap-icons";

export default function ConfirmPayment(props) {
    const { cart, data, nextHandler, backHandler } = props;

    const li_classes = "list-group-item d-flex justify-content-between";

    if (cart.type !== "USDT")
        return buyProduct(cart, data, backHandler, nextHandler);
    return (
        <>
            <h3 className="fs-6">Resumen de la compra</h3>
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
                        <h4 className="fs-5">ADVERTENCIA</h4>
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
    const li_classes = "list-group-item d-flex justify-content-between";

    return (
        <div>
            <h3 className="fs-6">Resumen de la compra</h3>
            <div className="container">
                <ul className="list-group mb-2">
                    <li className={li_classes}>
                        <span>Cantidad</span>
                        <b>
                            {cart.quantity} {cart.type}
                        </b>
                    </li>
                    <li className={li_classes}>
                        <span>Precio (1 {cart.type})</span>
                        {cart.price} $
                    </li>
                    <li className={li_classes + " list-group-item-secondary"}>
                        <span>Total a pagar</span>
                        <b>{cart.price * cart.quantity} $</b>
                    </li>
                </ul>
                <ul className="list-group mb-2">{payMethod(data)}</ul>
                <p>
                    Al pulsar <i>Pagar</i> aceptas los{" "}
                    <span className="text-primary">Términos de Servicio</span> y
                    las <span className="text-primary">Condiciones de Uso</span>{" "}
                    de InfoPay.
                </p>
                <div className="alert alert-warning">
                    <div className="alert-heading">
                        <h4 className="fs-5">ADVERTENCIA</h4>
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
