import React from "react";
import PaymentAdminItem from "./PaymentAdminItem";

const PaymentList = ({ payments }) => (
    <div className="col-md-12 col-lg-8 mt-lg-0 mt-4">
        <div className="card shadow-sm h-100" role="region" aria-labelledby="payment-list" tabIndex="0">
            <div className="card-body">
                <h2 id="payment-list" className="card-title h5">Últimos depósitos y retiros</h2>
                <ul className="list-group list-group-flush">
                    {payments.map((payment, index) => (
                        <PaymentAdminItem key={index} payment={payment} />
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

export default PaymentList;
