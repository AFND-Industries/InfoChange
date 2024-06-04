import React from "react";

const altPhoto = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

const PaymentItem = ({ payment, user = undefined }) => {
    const transactionDate = new Date(payment.date);

    const hours = ('0' + transactionDate.getHours()).slice(-2);
    const minutes = ('0' + transactionDate.getMinutes()).slice(-2);
    const day = ('0' + transactionDate.getDate()).slice(-2);
    const month = ('0' + (transactionDate.getMonth() + 1)).slice(-2);
    const year = transactionDate.getFullYear();

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    const drawUser = (user) => <img src={"https://github.com/" + user.username + ".png"} className="rounded rounded-5 me-2"
        style={{ width: '50px', height: '50px' }} onError={(e) => { e.target.src = altPhoto; }} alt={"Logo de " + user.name} />

    const drawLogo = (logo, w, wa, name) => <img src={logo} className="rounded rounded-5 me-2"
        style={{ width: (user !== undefined ? wa : w), height: (user !== undefined ? '35px' : '50px') }} alt={"Logo de " + name} />;
    const paypal = drawLogo("paypal.png", "100px", "70px", "PayPal");
    const mastercard = drawLogo("credit.png", "70px", "50px", "Mastercard");

    const textPayment =
        <>
            <span>{user !== undefined ? <span className="fw-bold">{user.username}</span> : <></>}&nbsp;
                {user !== undefined ? "ha" : "Has"} <span className="fw-bold">añadido</span> saldo </span>
            <span> {payment.method === "CREDIT" ? " con una" : "mediante"} <span className="fw-bold">{payment.method === "CREDIT" ? "tarjeta de crédito" : "PayPal"}</span></span>
        </>;

    const withdrawPayment =
        <>
            <span>{user !== undefined ? <span className="fw-bold">{user.username}</span> : <></>}&nbsp;
                {user !== undefined ? "ha" : "Has"} <span className="fw-bold">retirado</span> dinero </span>
            <span> a{payment.method === "CREDIT" ? " una" : ""} <span className="fw-bold">{payment.method === "CREDIT" ? "cuenta bancaria" : "PayPal"}</span></span>
        </>;

    return (
        <li key={payment.id} className="list-group-item px-0">
            <div className="row align-items-center">
                <div className="d-flex col-lg-9 d-flex align-items-start mb-3 mb-lg-0 flex-column">
                    <div className="d-flex flex-row">
                        {user !== undefined ? drawUser(payment.user) : <></>}
                        <div className={`d-flex align-items-${user !== undefined ? "end" : "center"}`}>
                            {payment.method === 'CREDIT' ? mastercard : paypal}
                        </div>
                    </div>
                    <div>
                        {payment.type === "PAY" ? textPayment : withdrawPayment}
                    </div>
                    <div className="d-flex flex-row text-secondary flex-lg-row flex-column" style={{ fontSize: "0.9em" }}>
                        {user === undefined ? <span>Información de la operación: {payment.info}</span> : <></>}
                    </div>
                </div>
                <div className="col-lg-3 d-flex flex-column align-items-center align-items-lg-end">
                    <span className={`fw-bold ${payment.type === "PAY" ? "text-success" : "text-danger"}`}>
                        {payment.type === "PAY" ? "+" : "-"}{payment.quantity}$</span>
                    <span className="text-secondary text-end" style={{ fontSize: "0.9em" }}>{formattedDate}</span>
                </div>
            </div>
        </li>
    );
};

export default PaymentItem;