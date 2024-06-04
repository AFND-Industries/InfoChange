import React from "react";

import PaymentItem from "./PaymentItem";

const PaymentHistory = ({ paymentHistory }) => {
    let renderPaymentHistory = null;

    if (paymentHistory) {
        const sortedPayment = paymentHistory.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        renderPaymentHistory = sortedPayment.map((payment, index) => {
            return <PaymentItem payment={payment} />;
        });
    }

    return (
        <ul className="list-group list-group-flush p-0 m-0">
            {renderPaymentHistory.length === 0 ? (
                <li className="list-group-item text-center">
                    <b className="fs-5">No se han encontrado resultados :(</b>
                </li>
            ) : (
                renderPaymentHistory
            )}
        </ul>
    );
};

export default PaymentHistory;
