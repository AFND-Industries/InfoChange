import { useRef } from "react";
import { Tooltip, OverlayTrigger, Button } from "react-bootstrap";
import { InfoCircle } from "react-bootstrap-icons";

export function PaypalForm(props) {
    const { dataHandler, backHandler, data } = props;

    const email = useRef(null);
    const password = useRef(null);

    return (
        <div>
            <h3 className="fs-6">
                Introduzca los datos de su cuenta de Paypal
            </h3>
            <div className="container">
                <div className="mb-3 py-1">
                    <label htmlFor="emailInput" className="form-label">
                        Correo Electrónico
                    </label>
                    <input
                        ref={email}
                        id="emailInput"
                        type="text"
                        defaultValue={
                            data.info !== undefined ? data.info.email : ""
                        }
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="passwordInput" className="form-label">
                        Contraseña
                    </label>
                    <input
                        id="passwordInput"
                        ref={password}
                        type="password"
                        className="form-control"
                    />
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <button
                            className="btn btn-outline-secondary w-100"
                            onClick={backHandler}
                        >
                            Volver
                        </button>
                    </div>
                    <div className="col">
                        <button
                            className="btn btn-primary w-100"
                            onClick={() =>
                                dataHandler({
                                    email: email.current.value,
                                    password: password.current.value,
                                })
                            }
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export function CreditForm(props) {
    const { dataHandler, backHandler, data } = props;

    const creditCard = useRef(null);
    const expDate = useRef(null);
    const cvv = useRef(null);

    return (
        <div>
            <h3 className="fs-6">Introduzca los datos de la tarjeta</h3>
            <div className="container">
                <div className="mb-3">
                    <label htmlFor="cardInput" className="form-label">
                        Número de tarjeta
                    </label>
                    <input
                        id="cardInput"
                        ref={creditCard}
                        type="text"
                        defaultValue={
                            data.info !== undefined ? data.info.cardNumber : ""
                        }
                        className="form-control"
                    />
                </div>
                <div className="row g-3">
                    <div className="col-md-6 col-12">
                        <label htmlFor="dateInput" className="form-label">
                            Fecha de expiración
                        </label>
                        <input
                            id="dateInput"
                            ref={expDate}
                            type="date"
                            defaultValue={
                                data.info !== undefined ? data.info.expDate : ""
                            }
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-6 col-12">
                        <div className="mb-3">
                            <label htmlFor="cvvInput" className="form-label">
                                Código de Seguridad{" "}
                                <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                        <Tooltip>
                                            <InfoCircle /> El código de
                                            seguridad es un código de 3 dígitos
                                            que se encuentra en el reverso de la
                                            tarjeta de crédito
                                        </Tooltip>
                                    }
                                >
                                    {({ reference, ...triggerHandler }) => (
                                        <InfoCircle
                                            ref={reference}
                                            {...triggerHandler}
                                        />
                                    )}
                                </OverlayTrigger>
                            </label>
                            <input
                                ref={cvv}
                                id="cvvInput"
                                type="text"
                                maxLength="3"
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <button
                            className="btn btn-outline-secondary w-100"
                            onClick={backHandler}
                        >
                            Volver
                        </button>
                    </div>
                    <div className="col">
                        <button
                            className="btn btn-primary w-100"
                            onClick={() =>
                                dataHandler({
                                    cardNumber: creditCard.current.value,
                                    expDate: expDate.current.value,
                                    cvv: cvv.current.value,
                                })
                            }
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
