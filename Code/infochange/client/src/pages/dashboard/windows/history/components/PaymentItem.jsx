import React from "react";

const PaymentItem = ({ payment }) => {
    const transactionDate = new Date(payment.date);

    const hours = ('0' + transactionDate.getHours()).slice(-2);
    const minutes = ('0' + transactionDate.getMinutes()).slice(-2);
    const day = ('0' + transactionDate.getDate()).slice(-2);
    const month = ('0' + (transactionDate.getMonth() + 1)).slice(-2);
    const year = transactionDate.getFullYear();

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    const textPayment = (
        <span>Has <span className="fw-bold">añadido {payment.quantity}$</span></span>
    );

    const textWithdrawal = (
        <span>Has <span className="fw-bold">retirado {payment.quantity}$</span></span>
    );

    return (
        <li key={payment.id} className="list-group-item px-0">
            <div className="row align-items-center">
                <div className="d-flex col-lg-9 d-flex align-items-start mb-3 mb-lg-0 flex-column">
                    <div className="d-flex align-items-center">
                        {payment.method === 'credit' ? "VISA" : "PAYPAL"}
                    </div>
                    <div>
                        {payment.type === "PAY" ? textPayment : textWithdrawal}
                    </div>
                    <div className="d-flex flex-row text-secondary flex-lg-row flex-column" style={{ fontSize: "0.9em" }}>
                        <span>Información de pago: {payment.info}</span>
                    </div>
                </div>
                <div className="col-lg-3 d-flex flex-column align-items-center align-items-lg-end">
                    <span className={`fw-bold me-1 ${payment.type === "PAY" ? "text-success" : "text-danger"}`}>
                        {payment.type === "PAY" ? "Pago" : "Retiro"}</span>
                    <span className="text-secondary text-end" style={{ fontSize: "0.9em" }}>{formattedDate}</span>
                </div>
            </div>
        </li>
    );
};

export default PaymentItem;