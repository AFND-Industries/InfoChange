import React from "react";

const altPhoto = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

const PaymentAdminItem = ({ payment }) => {
    const transactionDate = new Date(payment.date);

    const hours = ('0' + transactionDate.getHours()).slice(-2);
    const minutes = ('0' + transactionDate.getMinutes()).slice(-2);
    const day = ('0' + transactionDate.getDate()).slice(-2);
    const month = ('0' + (transactionDate.getMonth() + 1)).slice(-2);
    const year = transactionDate.getFullYear();

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    const drawUser = (user) => <img src={"https://github.com/" + payment.user.username + ".png"} className="rounded rounded-5 me-2"
        style={{ width: '50px', height: '50px' }} onError={(e) => { e.target.src = altPhoto; }} alt={"Logo de " + payment.user.name} />

    const drawLogo = (logo, w, name) => <img src={logo} className="rounded rounded-5 me-2"
        style={{ width: w, height: '25px' }} alt={"Logo de " + name} />;
    const paypal = drawLogo("paypal.png", "55px", "PayPal");
    const mastercard = drawLogo("credit.png", "35px", "Mastercard");

    const textPayment =
        <span>
            <b>{payment.user.username}&nbsp;</b>ha&nbsp;<b>añadido</b>&nbsp;saldo
            <span> {payment.method === "CREDIT" ? " con una" : "mediante"}&nbsp;<b>{payment.method === "CREDIT" ? "tarjeta de crédito" : "PayPal"}</b></span>
        </span>;

    const withdrawPayment =
        <span>
            <b>{payment.user.username}&nbsp;</b>ha&nbsp;<b>retirado</b>&nbsp;saldo
            <span> a{payment.method === "CREDIT" ? " una" : ""}&nbsp;<b>{payment.method === "CREDIT" ? "cuenta bancaria" : "PayPal"}</b></span>
        </span>;

    return (
        <li className="list-group-item px-0">
            <div className="row align-items-center">
                <div className="d-flex col-md-9 d-flex align-items-start mb-3 mb-md-0 flex-column">
                    <div className="d-flex flex-row">
                        {drawUser(payment.user)}
                        <div className="d-flex align-items-start flex-column">
                            {payment.method === 'CREDIT' ? mastercard : paypal}
                            <div className="d-flex">
                                {payment.type === "PAY" ? textPayment : withdrawPayment}
                            </div>

                        </div>
                    </div>
                </div>
                <div className="col-md-3 d-flex flex-column align-items-center align-items-md-end">
                    <span className={`fw-bold ${payment.type === "PAY" ? "text-success" : "text-danger"}`}>
                        {payment.type === "PAY" ? "+" : "-"}{payment.quantity}$</span>
                    <span className="text-secondary text-end" style={{ fontSize: "0.9em" }}>{formattedDate}</span>
                </div>
            </div>
        </li>
    );
};

export default PaymentAdminItem;