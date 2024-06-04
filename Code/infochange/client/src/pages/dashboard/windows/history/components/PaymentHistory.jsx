import React from "react";

const PaymentHistory = ({ paymentHistory }) => {
    let renderPaymentHistory = null;

    if (paymentHistory) {
        const sortedPayment = paymentHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

        renderPaymentHistory = sortedPayment.map((trade, index) => {
            return <TradeItem key={index} trade={trade} />;
        });
    }

    return (
        <ul className="list-group list-group-flush p-0 m-0">
            {renderPaymentHistory}
        </ul>
    );
};

export default PaymentHistory;
