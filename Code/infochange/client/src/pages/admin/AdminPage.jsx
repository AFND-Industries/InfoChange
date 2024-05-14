import React from "react";
import { useAdmin } from "./context/AdminContext";

export default function AdminPage() {
    const {
        getTotalUserBalance,
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
                <div className="col-12 text-center mb-4">
                    <h2>Panel de Administrador - InfoMetrics</h2>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Usuarios Registrados</h5>
                            <p className="card-text">{totalUsers}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Trades Realizados</h5>
                            <p className="card-text">{totalTransactions}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Ganancias por Comisiones</h5>
                            <p className="card-text">{totalCommission.toFixed(2)}$</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Usuarios con Mayor Balance</h5>
                            <div className="card-text">
                                <ul className="list-group list-group-flush">
                                    {usersByBalance.map((user, index) => (
                                        <li key={index} className="list-group-item ps-0 pe-0"><span className="fw-bold">{user.username}</span>: {user.totalBalance.toFixed(2)}$</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Monedas con Mayor Volumen</h5>
                            <ul className="list-group list-group-flush">
                                {coinsSortedByVolume.map((coin, index) => (
                                    <li key={index} className="list-group-item">{1}</li>
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
                            <h5 className="card-title">Historial de depósitos y retiros</h5>
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
                            <h5 className="card-title">Balance total de InfoChange</h5>
                            <p className="card-text">{totalExchangeBalance.toFixed(2)}$</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
