import { useRef } from "react";
import { PlusCircle, PlusLg } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import CoinsDataset from "./../../../data/CoinMarketCapData.json";

export default function Wallet(props) {
  const { wallet } = props;
  const navigate = useNavigate();
  const balance = useRef(null);

  const coins =
    wallet.coins !== undefined
      ? wallet.coins.map((coin) => {
          const data = CoinsDataset.data[coin.name][0];
          data.quantity = coin.quantity;
          return data;
        })
      : [];

  return (
    <>
      <div className="container d-flex flex-column align-items-center py-3">
        <h2>Tu saldo actual es</h2>
        <div
          className="rounded-pill p-5 text-white mb-4"
          style={{ backgroundColor: "#20c997", width: "fit-content" }}
        >
          <h1>{wallet.balance ?? 0} $</h1>
        </div>
        <div className="row">
          <div className="col-md-7 mb-3">
            <div className="input-group">
              <input ref={balance} type="number" className="form-control" />
              <span className="input-group-text">$</span>
            </div>
          </div>
          <div className="col-md-5">
            <button
              className="btn btn-outline-success d-flex align-items-center"
              onClick={() => addBalance(balance.current.value, navigate)}
            >
              <PlusCircle className="me-2" /> Añadir saldo
            </button>
          </div>
        </div>
      </div>
      <hr className="mx-4 my-2" />
      <div className="mx-4">
        <h4 className="text-center text-body-secondary">Monedas adquiridas</h4>
        {wallet.coins === undefined || wallet.coins.length === 0 ? (
          <h5 className="text-center text-body-secondary">No tienes monedas</h5>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {coins.map((coin, index) => (
              <div key={index} className="col">
                <div className="card h-100">
                  <div className="card-body">
                    <img
                      src={coin.logo}
                      className="card-img-top placeholder-glow"
                      style={{ width: "32px", height: "32px" }}
                      alt={coin.name}
                    />
                    <p className="card-text">{coin.name}</p>
                    <h5 className="card-title mt-0">
                      {coin.quantity} {coin.symbol}
                    </h5>
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
        type: "USD",
        quantity: balance,
      },
    });
  }
};
