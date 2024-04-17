import { useRef } from "react";
import { PlusCircle, PlusLg } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

export default function Wallet(props) {
  const { wallet } = props;
  const navigate = useNavigate();
  const balance = useRef(null);

  return (
    <>
      <div className="container d-flex flex-column align-items-center py-3">
        <h2>Tu saldo actual es</h2>
        <div
          className="rounded-pill p-5 text-white mb-4"
          style={{ backgroundColor: "#20c997", width: "fit-content" }}
        >
          <h1>{wallet.balance} $</h1>
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
