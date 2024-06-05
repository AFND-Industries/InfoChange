import { useState } from "react";

export default function SelectPayMethod(props) {
    const { creditHandler, paypalHandler, cart } = props;

    return (
        <div>
            <h3 className="fs-6">
                Seleccione el método de{" "}
                {cart.action === "in" ? "pago" : "ingreso"}
            </h3>
            <div className="container">
                <button
                    className="card clickableCard w-100 align-items-center py-3 mb-3"
                    role="button"
                    onClick={creditHandler}
                >
                    <h4 className="card-title">
                        {cart.action === "in"
                            ? "Tarjeta de crédito"
                            : "Cuenta bancaria"}
                    </h4>
                    <i
                        className={
                            "bi bi-" +
                            (cart.action === "in" ? "credit-card" : "bank")
                        }
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
