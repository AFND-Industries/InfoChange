export default function SelectPayMethod(props) {
    const { creditHandler, paypalHandler } = props;
    return (
        <div>
            <h3 className="fs-6">Seleccione el método de pago</h3>
            <div className="container">
                <div
                    className="card clickableCard mb-3"
                    onClick={creditHandler}
                >
                    <div className="card-body text-center">
                        <h4 className="card-title">Tarjeta de crédito</h4>
                        <i
                            className="bi bi-credit-card"
                            style={{ color: "#383d3b", fontSize: "3ch" }}
                        ></i>
                    </div>
                </div>
                <div
                    className="card clickableCard border-primary text-primary"
                    onClick={paypalHandler}
                >
                    <div className="card-body text-center">
                        <h4 className="card-title">Paypal</h4>
                        <i className="bi bi-paypal"></i>
                    </div>
                </div>
            </div>
        </div>
    );
}
