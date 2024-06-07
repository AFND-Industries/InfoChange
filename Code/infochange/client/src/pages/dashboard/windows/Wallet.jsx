import { useEffect, useRef, useState } from "react";
import { DashCircle, DashCircleFill, PlusCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useCoins } from "../../coins/CoinsAPI";
import CoinsDataset from "../../../data/CoinMarketCapData.json";
import { useAPI } from "../../../context/APIContext";

export default function Wallet(props) {
    const { wallet } = props;
    const navigate = useNavigate();
    const [error, setError] = useState(undefined);
    const balance = useRef(null);

    const { getPair } = useAPI();
    const { getCoins } = useCoins();

    onkeydown = (event) => {
        if (event.key === "Enter") addBalance(balance.current.value, navigate);
    };

    const coinsInfo = getCoins();

    const coins =
        wallet !== undefined
            ? wallet.map((coin) => {
                let data = CoinsDataset.data[coin.coin][0];
                if (data === undefined) {
                    data = {};
                    data.name = coin.coin;
                    data.logo = "/favicon.ico";
                }

                if (coin.coin !== "USDT") {
                    const pair = getPair(coin.coin + "USDT");
                    data.quantity = coin.quantity.toFixed(8);
                    data.price = pair.price * data.quantity;
                } else {
                    data.quantity = coin.quantity.toFixed(8);
                    data.price = coin.quantity;
                }

                return data;
            })
            : [];

    const totalMoney = coins ? coins.reduce((t, v) => t + (v.price === "?" ? 0 : parseFloat(v.price)), 0) : 0;
    const btcusdt = getPair("BTCUSDT");

    return (
        <>
            <div className="container d-flex flex-column align-items-center py-3">
                <div className="d-flex align-items-center mb-3">
                    <div className="d-flex flex-column me-5">
                        <h4 className="text-secondary mb-0">Balance de la cuenta:</h4>
                        <div className="d-flex align-items-end">
                            <h1 className="mb-0">{(btcusdt === undefined || btcusdt.price === undefined ? 0 :
                                (totalMoney / btcusdt.price)).toFixed(8)}</h1><h5 className="ms-1 mb-1"> BTC</h5>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <h4 className="text-secondary mb-0">Valor estimado:</h4>
                        <h1 className="mb-0">{totalMoney.toFixed(2)}$</h1>
                    </div>
                </div>
                <div className="row g-2">
                    <div className="col-12">
                        <label htmlFor="dollarInput">Cantidad de dinero:</label>
                        <div className="input-group">
                            <input
                                ref={balance}
                                type="number"
                                id="dollarInput"
                                className="form-control"
                            />
                            <span className="input-group-text">$</span>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <button
                            className="btn btn-outline-danger d-flex align-items-center w-100"
                            onClick={() => {
                                if (
                                    parseFloat(balance.current.value) >
                                    parseFloat(
                                        wallet.find((w) => w.coin === "USDT")
                                            .quantity
                                    )
                                ) {
                                    setError(
                                        "No tienes suficiente saldo en la cuenta"
                                    );
                                    balance.current.value = "";
                                } else {
                                    withdrawBalance(
                                        balance.current.value,
                                        navigate,
                                        setError
                                    );
                                }
                            }}
                        >
                            <DashCircle className="me-2" /> Retirar saldo
                        </button>
                    </div>
                    <div className="col-sm-6">
                        <button
                            className="btn btn-success d-flex align-items-center w-100"
                            onClick={() => {
                                if (balance.current.value < 1000000)
                                    addBalance(
                                        balance.current.value,
                                        navigate,
                                        setError
                                    );
                                else
                                    setError(
                                        "No puedes añadir tanto dinero. Prueba una cantidad menor a 1 millón de dólares"
                                    );

                                balance.current.value = "";
                            }}
                        >
                            <PlusCircle className="me-2" /> Añadir saldo
                        </button>
                    </div>
                </div>
                {error ? (
                    <div className="alert alert-danger mt-3 mb-0 w-100 text-center">
                        {error}
                    </div>
                ) : undefined}
            </div>
            <hr className="mx-4 my-2" />
            <div className="mx-4">
                <h2 className="fs-4 text-center text-body-secondary mb-3">
                    Tu cartera
                </h2>
                {coins.length === 0 ? (
                    <h3 className="fs-5 text-center text-body-secondary mb-3">
                        No tienes monedas
                    </h3>
                ) : (
                    <div className="row g-3 mb-3">
                        {coins.map((coin, index) => (
                            <div key={index} className="col-lg-4 col-md-6 col">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <img
                                            src={"/favicon.ico"}
                                            name="ph"
                                            alt="Loading coin..."
                                            width={"32px"}
                                            height={"32px"}
                                        />
                                        <img
                                            src={coin.logo}
                                            className="card-img-top placeholder-glow"
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                            }}
                                            onLoad={(e) => {
                                                const loadingImage =
                                                    e.target.parentElement.querySelector(
                                                        'img[name="ph"]'
                                                    );
                                                loadingImage.style.display =
                                                    "none";
                                                e.target.style.display =
                                                    "block";
                                            }}
                                            alt={coin.name}
                                        />
                                        <p className="card-text">{coin.name}</p>
                                        <h3 className="fs-5 card-title mt-0 mb-1">
                                            {coin.quantity} {coin.symbol}
                                        </h3>
                                        <h4 className="fs-6 text-secondary">
                                            ~{parseFloat(coin.price).toFixed(2)} $
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

const addBalance = (balance, navigate, setError) => {
    balance = parseFloat(balance);
    if (isNaN(balance) || balance <= 0)
        setError("El saldo a añadir debe ser mayor que 0");
    else {
        navigate("/payment", {
            state: {
                type: "USDT",
                quantity: balance,
                action: "in",
            },
        });
    }
};

const withdrawBalance = (balance, navigate, setError) => {
    balance = parseFloat(balance);
    if (isNaN(balance) || balance <= 0)
        setError("El saldo a retirar debe ser mayor que 0");
    else {
        navigate("/payment", {
            state: {
                type: "USDT",
                quantity: balance,
                action: "out",
            },
        });
    }
};
