import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";

import Banner from "../../assets/payment_banner.png";

import "./Payment.css";
import PaymentCompleted from "./steps/PaymentCompleted";
import ConfirmPayment from "./steps/ConfirmPayment";
import { CreditForm, IBANForm, PaypalForm } from "./steps/DataForm";
import SelectPayMethod from "./steps/SelectPayMethod";
import { useCoins } from "../coins/CoinsAPI";
import { useAPI } from "../../context/APIContext";
import { XLg } from "react-bootstrap-icons";

export default function Payment(props) {
    const TIMEOUT = 10;

    const [step, setStep] = useState({ step: 1, data: {} });
    const [counter, setCounter] = useState(0);
    const [feedback, setFeedback] = useState(undefined);
    const state = useLocation()?.state;
    const [cart, setCart] = useState(state === null ? props.cart : state);
    const _fupdate_ = useRef();

    const { doGetCoinPrice } = useCoins();
    const { buyProduct, withdrawBalance } = useAPI(); // as APIContextType;

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
            <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
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
        <div className="anim-gradient">
            <div className="container d-flex flex-column justify-content-center min-vh-100">
                <div className="card p-2 mb-3 mt-5">
                    <div className="card-body">
                        <div className="container d-flex align-items-center">
                            <img
                                className="mb-3 me-3"
                                alt="InfoPay banner"
                                src={Banner}
                                width={"25%"}
                            />
                            <h1 className="fs-3">
                                Plataforma de pago InfoPay
                                <span className="fs-6">&reg;</span>
                            </h1>

                            <Link
                                to={"/"}
                                className={
                                    "ms-auto" +
                                    (step.step === 4 ? " d-none" : "")
                                }
                            >
                                <button className="btn btn-outline-danger text-center">
                                    <XLg className="me-2" />
                                    <span className="d-sm-inline d-none">
                                        Cancelar{" "}
                                        {cart.action === "in"
                                            ? "pago"
                                            : "ingreso"}
                                    </span>
                                </button>
                            </Link>
                        </div>
                        <div className="row mb-3 g-4">
                            <aside className="col-md-4">
                                <h2 className="fs-4">
                                    Pasos del{" "}
                                    {cart.action === "in" ? "pago" : "ingreso"}
                                </h2>{" "}
                                <ol className="list-group list-group-flush">
                                    <li
                                        className={
                                            "list-group-item" +
                                            (step.step === 1 ? " active" : "")
                                        }
                                    >
                                        1 - Seleccione tipo de{" "}
                                        {cart.action === "in"
                                            ? "pago"
                                            : "ingreso"}
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
                                        3 - Resumen de
                                        {cart.action === "in"
                                            ? " la compra"
                                            : "l ingreso"}
                                        {doneCheck(3, step.step)}
                                    </li>
                                    <li
                                        className={
                                            "list-group-item" +
                                            (step.step === 4 ? " active" : "")
                                        }
                                    >
                                        4 -{" "}
                                        {cart.action === "in"
                                            ? "Pago"
                                            : "Ingreso"}{" "}
                                        completado
                                        {doneCheck(4, step.step)}
                                    </li>
                                </ol>
                            </aside>
                            <main className="col-md-8">
                                <h2 className="fs-4">Paso {step.step}</h2>
                                <div className="mb-3">
                                    {step.step === 1 ? (
                                        <SelectPayMethod
                                            cart={cart}
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
                                            ibanHandler={() =>
                                                setStep({
                                                    step: 2,
                                                    data: { type: "iban" },
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
                                            nextHandler={async (method) => {
                                                const loadingScreen =
                                                    document.getElementById(
                                                        "loading-screen"
                                                    );

                                                loadingScreen.style.display =
                                                    "block";

                                                if (method.type === "iban")
                                                    method.type = "credit";

                                                const result =
                                                    cart.action === "in"
                                                        ? await buyProduct(
                                                            { cart: cart },
                                                            method
                                                        )
                                                        : await withdrawBalance(
                                                            { cart: cart },
                                                            method
                                                        );
                                                loadingScreen.style.display =
                                                    "none";

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
                            </main>
                        </div>
                        <section className="progress">
                            <div
                                role="progressbar"
                                aria-label="Barra de progreso"
                                aria-valuemin={1}
                                aria-valuemax={4}
                                aria-valuenow={step.step}
                                className="progress-bar"
                                style={{ width: `${step.step * 25}%` }}
                            ></div>
                        </section>
                        {cart.type !== "USDT" && step.step < 4
                            ? `El precio se actualizará en ${TIMEOUT - counter
                            } segundos`
                            : ""}
                    </div>
                </div>
                <p className="text-center text-light">
                    AFND Industries 2024 &copy;
                </p>
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
    else if (data.type === "iban")
        return (
            <IBANForm
                data={data}
                dataHandler={dataHandler}
                backHandler={backHandler}
            />
        );
    return undefined;
}
