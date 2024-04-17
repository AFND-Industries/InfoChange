import { Link } from "react-router-dom";
import { PersonFill, Wallet2 } from "react-bootstrap-icons";
import Profile from "./windows/Profile";
import Wallet from "./windows/Wallet";
import { useState } from "react";

export default function Dashboard() {
  const [page, setPage] = useState(0);

  const mockData = {
    profile: {
      username: "tb18003",
      name: "Tomas",
      surname: "Bustamante",
      email: "tb18ms@gmail.com",
      phone: "+34 123456789",
      document: "11111111A",
      address: "Calle Falsa 123",
    },
    wallet: {
      balance: 1342.23,
      coins: [
        { name: "Bitcoin", quantity: 0.0005 },
        { name: "Ethereum", quantity: 0.005 },
        { name: "Dogecoin", quantity: 100 },
        { name: "Litecoin", quantity: 0.05 },
        { name: "Ripple", quantity: 1000 },
      ],
    },
  };

  const pages = [
    <Profile profile={mockData.profile} />,
    <Wallet wallet={mockData.wallet} />,
  ];

  const labels = ["Perfil", "Cartera"];

  return (
    <div className="container mt-2">
      <h1 className="text-center">Panel de control</h1>
      <div className="row align-items-start">
        <div className="col-3 mb-4">
          <div className="list-group">
            <button
              type="button"
              className={`list-group-item list-group-item-action ${
                page === 0 ? "active" : ""
              } d-flex align-items-center`}
              onClick={() => setPage(0)}
            >
              <PersonFill className="me-3" /> Perfil
            </button>
            <button
              type="button"
              className={`list-group-item list-group-item-action ${
                page === 1 ? "active" : ""
              } d-flex align-items-center`}
              onClick={() => setPage(1)}
            >
              <Wallet2 className="me-3" />
              Cartera
            </button>
            <button
              type="button"
              className="list-group-item list-group-item-action disabled"
              disabled
            >
              Disabled item
            </button>
          </div>
        </div>
        <div className="col-9">
          <div className="card">
            <div className="card-header text-center">{labels[page]}</div>
            {pages[page]}
          </div>
        </div>
      </div>
    </div>
  );
}
