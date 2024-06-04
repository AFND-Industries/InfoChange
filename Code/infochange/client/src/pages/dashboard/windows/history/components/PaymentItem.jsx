import React from "react";

const PaymentItem = ({ payment }) => {
    const transactionDate = new Date(payment.date);

    const hours = ('0' + transactionDate.getHours()).slice(-2);
    const minutes = ('0' + transactionDate.getMinutes()).slice(-2);
    const day = ('0' + transactionDate.getDate()).slice(-2);
    const month = ('0' + (transactionDate.getMonth() + 1)).slice(-2);
    const year = transactionDate.getFullYear();

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    return (
        <li key={payment.id} className="list-group-item px-0">
            <div className="row align-items-center">
                <div className="col-9">
                    Has&nbsp;<span className="fw-bold">{payment.type === "PAY" ? "comprado" : "retirado"} {payment.quantity}$</span>
                </div>
                <div className="col-3 text-end">
                    <span className="text-secondary text-end" style={{ fontSize: "0.9em" }}>{formattedDate}</span>
                </div>
            </div>
        </li>
    );
};

export default PaymentItem;