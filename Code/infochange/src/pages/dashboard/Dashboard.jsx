import {
  Link,
  redirect,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";
import { ChevronLeft, PersonFill, Wallet2 } from "react-bootstrap-icons";
import Profile from "./windows/Profile";
import Wallet from "./windows/Wallet";
import Users from "./../../data/users.json";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [page, setPage] = useState(0);

  const navigate = useNavigate();

  const params = useParams();

  if (params.username === undefined) return <Navigate to="/login" />;

  const mockData =
    Users.find((user) => user.profile.username === params.username) ?? [];

  console.log(mockData.length);
  console.log(Users);

  if (mockData.length === 0) {
    const state = {
      error: "No se ha encontrado su cuenta",
    };
    console.log(state);
    return <Navigate to="/login" state={state} />;
  }

  const pages = [
    <Profile profile={mockData.profile} />,
    <Wallet wallet={mockData.wallet} />,
  ];

  const labels = ["Perfil", "Cartera"];

  return (
    <div className="container">
      <div className="card my-4">
        <h1 className="text-center"> Panel de control</h1>
      </div>
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

            <Link to="/" style={{ textDecoration: "none" }}>
              <button
                type="button"
                className={
                  "list-group-item list-group-item-action d-flex align-items-center"
                }
              >
                <ChevronLeft className="me-3" />
                Volver al menú
              </button>
            </Link>
          </div>
        </div>
        <div className="col-9 mb-3">
          <div className="card">
            <div className="card-header text-center">{labels[page]}</div>
            {pages[page]}
          </div>
        </div>
      </div>
    </div>
  );
}
