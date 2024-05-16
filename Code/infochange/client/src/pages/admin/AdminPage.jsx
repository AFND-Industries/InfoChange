import React from "react";
import { useAdmin } from "./context/AdminContext";
import Banner from "../../assets/admin_banner.png";

export default function AdminPage() {
    const {
        getTotalUsers,
        getTotalTransactions,
        getTotalComission,
        getTotalExchangeBalance,
        getUsersSortedByBalance,
        getCoinsSortedByExchangeVolume,
        getPaymentHistory
    } = useAdmin();

    // Datos simulados para mostrar en el panel
    const totalUsers = getTotalUsers();
    const totalTransactions = getTotalTransactions();
    const totalCommission = getTotalComission();
    const totalExchangeBalance = getTotalExchangeBalance();

    const usersByBalance = getUsersSortedByBalance();
    const coinsSortedByVolume = getCoinsSortedByExchangeVolume();
    const paymentHistory = getPaymentHistory();

    return (
        <div className="container mt-4 mb-4">
            <div className="row">
                <div className="col-12 mb-4">
                    <img src={Banner} style={{ width: "30%", minWidth: "250px" }} />
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Usuarios Registrados</h2>
                            <p className="card-text h5">{totalUsers}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Trades Realizados</h2>
                            <p className="card-text h5">{totalTransactions}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Ganancias por Comisiones</h2>
                            <p className="card-text h5">{totalCommission.toFixed(2)}$</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Usuarios con Mayor Balance</h2>
                            <div className="card-text">
                                <ul className="list-group list-group-flush">
                                    {usersByBalance.map((user, index) => (
                                        <li key={index} className="list-group-item ps-0 pe-0 d-flex align-items-center">
                                            <img onError={(event) => event.target.src = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"}
                                                src={"https://github.com/" + user.username + ".png"} alt={user.username} className="me-2 rounded-5"
                                                style={{ width: "40px", height: "40px" }} />
                                            <span className="fw-bold h5 m-0">{user.username}</span>
                                            <span className="h5 m-0">:  {user.totalBalance.toFixed(2)}$</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Monedas con Mayor Volumen</h2>
                            <ul className="list-group list-group-flush">
                                {coinsSortedByVolume.map((coin, index) => (
                                    <li key={index} className="list-group-item ps-0 pe-0 d-flex align-items-center">
                                        <img src={coin.logo} alt={coin.name} className="me-2 rounded-4"
                                            style={{ width: "40px", height: "40px" }} />
                                        <span className="h5 m-0">
                                            <span className="fw-bold m-0 me-2">{coin.name}: </span>
                                            <span className="m-0">{coin.volume.toFixed(8)} {coin.symbol}</span>
                                            <span className="h6 text-secondary m-0"> ~{coin.dolar_volume.toFixed(2)}$</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Historial de depósitos y retiros</h2>
                            <ul className="list-group list-group-flush">
                                {paymentHistory.map((payment, index) => (
                                    <li key={index} className="list-group-item">{2}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Balance total de InfoChange</h2>
                            <p className="card-text h5">{totalExchangeBalance.toFixed(2)}$</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
