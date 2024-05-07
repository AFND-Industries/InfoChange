import { useState } from "react";

import { PersonFill, Wallet2 } from "react-bootstrap-icons";
import Profile from "./windows/Profile";
import Wallet from "./windows/Wallet";

import { useAuth } from "../authenticator/AuthContext";
import { Navigate } from "react-router-dom";

function Dashboard() {
    const { getActualUser } = useAuth();
    const [page, setPage] = useState(0);

    const user = getActualUser();

    if (user === null) {
        return <Navigate to={"/login"} />;
    }

    user.wallet = user.wallet ?? {};
    user.wallet.balance = user.profile.balance;

    console.log(user);

    const pages = [
        <Profile profile={user.profile} />,
        <Wallet wallet={user.wallet ?? {}} />,
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
                    </div>
                </div>
                <div className="col-9 mb-3">
                    <div className="card">
                        <div className="card-header text-center">
                            {labels[page]}
                        </div>
                        {pages[page]}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
