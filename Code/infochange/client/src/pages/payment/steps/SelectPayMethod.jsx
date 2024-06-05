import { useState } from "react";

export default function SelectPayMethod(props) {
    const { ibanHandler, creditHandler, paypalHandler, cart } = props;

    return (
        <div>
            <h3 className="fs-6">Seleccione el método de pago</h3>
            <div className="container">
                <button
                    className="card clickableCard w-100 align-items-center py-3 mb-3"
                    role="button"
                    onClick={cart.action === "in" ? creditHandler : ibanHandler}
                >
                    <h4 className="card-title">Tarjeta de crédito</h4>
                    <i
                        className="bi bi-credit-card"
                        style={{ color: "#383d3b", fontSize: "3ch" }}
                    ></i>
                </button>
                <button
                    className="card clickableCard border-primary text-primary w-100 align-items-center py-3"
                    role="button"
                    onClick={paypalHandler}
                >
                    <h4 className="card-title">Paypal</h4>
                    <i className="bi bi-paypal"></i>
                </button>
            </div>
        </div>
    );
}
