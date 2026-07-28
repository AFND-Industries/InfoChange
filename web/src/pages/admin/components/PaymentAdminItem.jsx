import Avatar from "../../../components/Avatar";
import { formatDateTime } from "../../../lib/format";
import { formatAmount } from "./amount";

/**
 * El medio de pago ya no es "CREDIT o PayPal": el servidor distingue tarjeta,
 * cuenta bancaria y PayPal, y guarda solo el tipo, nunca el numero completo.
 */
const METHODS = {
    CARD: {
        logo: "/credit.png",
        width: "35px",
        name: "Mastercard",
        label: "tarjeta de crédito",
        deposit: "con una",
        withdrawal: "a una",
    },
    IBAN: {
        logo: "/credit.png",
        width: "35px",
        name: "Cuenta bancaria",
        label: "cuenta bancaria",
        deposit: "desde una",
        withdrawal: "a una",
    },
    PAYPAL: {
        logo: "/paypal.png",
        width: "55px",
        name: "PayPal",
        label: "PayPal",
        deposit: "mediante",
        withdrawal: "a",
    },
};

const UNKNOWN_METHOD = {
    logo: "/credit.png",
    width: "35px",
    name: "Medio de pago",
    label: "otro medio de pago",
    deposit: "mediante",
    withdrawal: "a",
};

const PaymentAdminItem = ({ payment }) => {
    const method = METHODS[payment.method] ?? UNKNOWN_METHOD;
    const isDeposit = payment.kind === "DEPOSIT";

    return (
        <li className="list-group-item px-0">
            <div className="row align-items-center">
                <div className="d-flex col-md-9 d-flex align-items-start mb-3 mb-md-0 flex-column">
                    <div className="d-flex flex-row">
                        <Avatar
                            username={payment.username}
                            size={50}
                            rounded={false}
                            className="rounded rounded-5 me-2"
                        />
                        <div className="d-flex align-items-start flex-column">
                            <img src={method.logo} className="rounded rounded-5 me-2"
                                style={{ width: method.width, height: '25px' }} alt={"Logo de " + method.name} />
                            <div className="d-flex">
                                <span>
                                    <b>{payment.username}&nbsp;</b>ha&nbsp;<b>{isDeposit ? "añadido" : "retirado"}</b>&nbsp;saldo
                                    <span> {isDeposit ? method.deposit : method.withdrawal}&nbsp;<b>{method.label}</b></span>
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="col-md-3 d-flex flex-column align-items-center align-items-md-end">
                    <span className={`fw-bold ${isDeposit ? "text-success" : "text-danger"}`}>
                        {isDeposit ? "+" : "-"}{formatAmount(payment.amount, payment.asset)}</span>
                    <span className="text-secondary text-end" style={{ fontSize: "0.9em" }}>{formatDateTime(payment.createdAt)}</span>
                </div>
            </div>
        </li>
    );
};

export default PaymentAdminItem;
