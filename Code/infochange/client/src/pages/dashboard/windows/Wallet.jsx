import { useEffect, useRef, useState } from "react";
import { DashCircle, DashCircleFill, PlusCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useCoins } from "../../coins/CoinsAPI";
import CoinsDataset from "../../../data/CoinMarketCapData.json";

export default function Wallet(props) {
    const { wallet } = props;
    const navigate = useNavigate();
    const balance = useRef(null);

    const { getCoins } = useCoins();

    onkeydown = (event) => {
        if (event.key === "Enter") addBalance(balance.current.value, navigate);
    };

    const coinsInfo = getCoins();

    const coins =
        wallet !== undefined
            ? wallet.map((coin) => {
                  const data = CoinsDataset.data[coin.coin][0];
                  if (coin.coin !== "USDT") {
                      const price = coinsInfo.find(
                          (v) => v.symbol === `${coin.coin}USDT`
                      );
                      data.quantity = coin.quantity.toFixed(8);
                      data.price = price
                          ? coin.quantity * price.lastPrice
                          : "?";
                  } else {
                      data.quantity = coin.quantity.toFixed(8);
                      data.price = coin.quantity;
                  }

                  return data;
              })
            : [];

    return (
        <>
            <div className="container d-flex flex-column align-items-center py-3">
                <h2>Balance</h2>
                <div
                    className="rounded-pill p-4 text-white mb-4 bg-success"
                    style={{ width: "fit-content" }}
                >
                    <h1>
                        {coins
                            ? coins
                                  .reduce(
                                      (t, v) =>
                                          t + (v.price === "?" ? 0 : v.price),
                                      0
                                  )
                                  .toFixed(2)
                            : 0}{" "}
                        $
                    </h1>
                </div>
                <div className="row g-4">
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
                    <div className="col-md-6">
                        <button
                            className="btn btn-outline-danger d-flex align-items-center w-100"
                            onClick={() =>
                                addBalance(balance.current.value, navigate)
                            }
                        >
                            <DashCircle className="me-2" /> Retirar saldo
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button
                            className="btn btn-success d-flex align-items-center w-100"
                            onClick={() =>
                                addBalance(balance.current.value, navigate)
                            }
                        >
                            <PlusCircle className="me-2" /> Añadir saldo
                        </button>
                    </div>
                </div>
                <div className="row"></div>
            </div>
            <hr className="mx-4 my-2" />
            <div className="mx-4">
                <h4 className="text-center text-body-secondary mb-3">
                    Tu cartera
                </h4>
                {coins.length === 0 ? (
                    <h5 className="text-center text-body-secondary mb-3">
                        No tienes monedas
                    </h5>
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
                                        <h5 className="card-title mt-0 mb-1">
                                            {coin.quantity} {coin.symbol}
                                        </h5>
                                        <h6 className="text-secondary">
                                            ~{coin.price.toFixed(2)} $
                                        </h6>
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

const addBalance = (balance, navigate) => {
    balance = parseFloat(balance);
    if (isNaN(balance) || balance <= 0)
        alert("El saldo a añadir debe ser mayor que 0");
    else {
        navigate("/payment", {
            state: {
                type: "USDT",
                quantity: balance,
            },
        });
    }
};
