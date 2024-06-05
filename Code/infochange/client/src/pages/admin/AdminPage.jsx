import React from "react";
import { useAdmin } from "./context/AdminContext";
import Banner from "../../assets/admin_banner.png";
import BizumAdminItem from "./components/BizumAdminItem";
import PaymentAdminItem from "./components/PaymentAdminItem";
import CoinVolumeItem from "./components/CoinVolumeItem";
import UserBalanceItem from "./components/UserBalanceItem";

export default function AdminPage() {
    const {
        getTotalUsers,
        getTotalTransactions,
        getBizumHistorySortedByDate,
        getTotalComission,
        getTotalExchangeBalance,
        getUsersSortedByBalance,
        getCoinsSortedByExchangeVolume,
        getPaymentHistorySortedByDate
    } = useAdmin();

    // Datos simulados para mostrar en el panel
    const totalUsers = getTotalUsers();
    const totalTransactions = getTotalTransactions();
    const totalCommission = getTotalComission();
    const totalExchangeBalance = getTotalExchangeBalance();

    const bizumHistoryByDate = getBizumHistorySortedByDate();
    const usersByBalance = getUsersSortedByBalance();
    const coinsSortedByVolume = getCoinsSortedByExchangeVolume();
    const paymentHistory = getPaymentHistorySortedByDate();

    return (
        <main className="container mt-4 mb-4">
            <div className="row">
                <div className="col-md-6 mb-4">
                    <img src={Banner} style={{ width: "60%", minWidth: "250px" }} alt="Logo del panel de admin" />
                </div>
                <section className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Balance total de InfoChange</h2>
                            <p className="card-text h5">{totalExchangeBalance.toFixed(2)}$</p>
                        </div>
                    </div>
                </section>
            </div>
            <div className="row">
                <section className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Usuarios Registrados</h2>
                            <p className="card-text h5">{totalUsers}</p>
                        </div>
                    </div>
                </section>
                <section className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Trades Realizados</h2>
                            <p className="card-text h5">{totalTransactions}</p>
                        </div>
                    </div>
                </section>
                <section className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Ganancias por Comisiones</h2>
                            <p className="card-text h5">{totalCommission.toFixed(2)}$</p>
                        </div>
                    </div>
                </section>
            </div>
            <div className="row mt-4">
                <section className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Usuarios con Mayor Balance</h2>
                            <div className="card-text">
                                <ul className="list-group list-group-flush">
                                    {usersByBalance.map((user, index) => (
                                        <UserBalanceItem key={index} user={user} />
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Monedas con Mayor Volumen</h2>
                            <ul className="list-group list-group-flush">
                                {coinsSortedByVolume.map((coin, index) => (
                                    <CoinVolumeItem key={index} coin={coin} />
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
            <div className="row mt-4">
                <section className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Bizums recientes</h2>
                            <ul className="list-group list-group-flush">
                                {bizumHistoryByDate.map((item, index) => (
                                    <BizumAdminItem key={index} item={item} />
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
                <section className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Depósitos y retiros recientes</h2>
                            <ul className="list-group list-group-flush">
                                {paymentHistory.map((payment, index) => (
                                    <PaymentAdminItem key={index} payment={payment} />
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
