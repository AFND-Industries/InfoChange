import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";

import Banner from "../../assets/payment_banner.png";

import "./payment.css";
import PaymentCompleted from "./steps/PaymentCompleted";
import ConfirmPayment from "./steps/ConfirmPayment";
import { CreditForm, PaypalForm } from "./steps/DataForm";
import SelectPayMethod from "./steps/SelectPayMethod";
import { useCoins } from "../coins/CoinsAPI";
import { useAPI } from "../../context/APIContext";

export default function Payment(props) {
    const TIMEOUT = 10;

    const [step, setStep] = useState({ step: 1, data: {} });
    const [counter, setCounter] = useState(0);
    const [feedback, setFeedback] = useState(undefined);
    const state = useLocation()?.state;
    const [cart, setCart] = useState(state === null ? props.cart : state);
    const _fupdate_ = useRef();

    const { doGetCoinPrice } = useCoins();
    const { buyProduct } = useAPI(); // as APIContextType;

    const updateCart = async (cart) => {
        const _cart = cart;
        _cart.price = (await doGetCoinPrice(`${cart.type}USDT`)).data.price;
        setCart(cart);
        return cart.price === _cart.price;
    };

    useEffect(() => {
        if (cart.type === "USDT") return;

        if (!_fupdate_.current) {
            updateCart(cart);
            _fupdate_.current = true;
        }

        if (step.step < 4) {
            const id = setInterval(async () => {
                setCounter(counter + 1);

                if (counter === TIMEOUT) {
                    setCounter(0);
                    await updateCart(cart);
                }
            }, 1000);

            return () => clearInterval(id);
        }
    });

    if (cart === null || step.step > 4 || step.step < 1)
        return (
            <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
                <div className="card p-2">
                    <div className="card-body text-center">
                        <h3>Ups... ha ocurrido un error con tu compra</h3>
                        <h4 className="text-body-secondary">
                            Vuelva a intentarlo más tarde :(
                        </h4>
                        <Link to={"/dashboard"}>
                            <button className="btn btn-outline-danger">
                                Volver al panel de control
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );

    return (
        <div
            style={{
                backgroundColor: "#52dee5",
            }}
        >
            <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
                <div className="card p-2">
                    <div className="card-body">
                        <div className="container d-flex align-items-center">
                            <img className="mb-3" src={Banner} width={"25%"} />

                            <Link
                                to={"/"}
                                className={
                                    "ms-auto" +
                                    (step.step === 4 ? " d-none" : "")
                                }
                            >
                                <button className="btn btn-outline-danger">
                                    <i className="bi bi-x-lg me-2"></i>
                                    <span className="d-sm-inline d-none">
                                        Cancelar pago
                                    </span>
                                </button>
                            </Link>
                        </div>
                        <div className="row mb-3">
                            <div className="col-sm-4">
                                <h4>Pasos del pago</h4>
                                <ol className="list-group list-group-flush">
                                    <li
                                        className={
                                            "list-group-item" +
                                            (step.step === 1 ? " active" : "")
                                        }
                                    >
                                        1 - Seleccione tipo de pago
                                        {doneCheck(1, step.step)}
                                    </li>
                                    <li
                                        className={
                                            "list-group-item" +
                                            (step.step === 2 ? " active" : "")
                                        }
                                    >
                                        2 - Introduzca los datos requeridos
                                        {doneCheck(2, step.step)}
                                    </li>
                                    <li
                                        className={
                                            "list-group-item" +
                                            (step.step === 3 ? " active" : "")
                                        }
                                    >
                                        3 - Resumen de la compra
                                        {doneCheck(3, step.step)}
                                    </li>
                                    <li
                                        className={
                                            "list-group-item" +
                                            (step.step === 4 ? " active" : "")
                                        }
                                    >
                                        4 - Pago completado
                                        {doneCheck(4, step.step)}
                                    </li>
                                </ol>
                            </div>
                            <div className="col-sm-8">
                                <h4>Paso {step.step}</h4>
                                <div className="mb-3">
                                    {step.step === 1 ? (
                                        <SelectPayMethod
                                            creditHandler={() =>
                                                setStep({
                                                    step: 2,
                                                    data: { type: "credit" },
                                                })
                                            }
                                            paypalHandler={() =>
                                                setStep({
                                                    step: 2,
                                                    data: { type: "paypal" },
                                                })
                                            }
                                        />
                                    ) : step.step === 2 ? (
                                        dataForm(
                                            step.data,
                                            (d) => {
                                                const newStep = step.data;
                                                newStep.info = d;
                                                setStep({
                                                    step: 3,
                                                    data: newStep,
                                                });
                                            },
                                            () => {
                                                const newStep = step.data;
                                                newStep.info = null;
                                                setStep({
                                                    step: 1,
                                                    data: newStep,
                                                });
                                            }
                                        )
                                    ) : step.step === 3 ? (
                                        <ConfirmPayment
                                            cart={cart}
                                            data={step.data}
                                            nextHandler={async () => {
                                                const result = await buyProduct(
                                                    { cart: cart }
                                                );
                                                setFeedback(
                                                    result.data.feedback
                                                );
                                                setStep({
                                                    step: 4,
                                                    data: step.data,
                                                });
                                            }}
                                            backHandler={() =>
                                                setStep({
                                                    step: 2,
                                                    data: step.data,
                                                })
                                            }
                                        />
                                    ) : (
                                        <PaymentCompleted
                                            cart={cart}
                                            feedback={feedback}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="progress">
                            <div
                                className="progress-bar"
                                style={{ width: `${step.step * 25}%` }}
                            ></div>
                        </div>
                        {cart.type !== "USDT" && step.step < 4
                            ? `El precio se actualizará en ${
                                  TIMEOUT - counter
                              } segundos`
                            : ""}
                    </div>
                </div>
            </div>
        </div>
    );
}

function doneCheck(step, actualStep) {
    if (step < actualStep) {
        return (
            <i
                className="bi bi-check"
                style={{ fontSize: "20px", color: "green" }}
            ></i>
        );
    }
}

function dataForm(data, dataHandler, backHandler) {
    if (data.type === "credit")
        return (
            <CreditForm
                data={data}
                dataHandler={dataHandler}
                backHandler={backHandler}
            />
        );
    else if (data.type === "paypal")
        return (
            <PaypalForm
                data={data}
                dataHandler={dataHandler}
                backHandler={backHandler}
            />
        );
    return undefined;
}
