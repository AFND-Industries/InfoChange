import React from "react";
import { useAdmin } from "./context/AdminContext";
import Banner from "../../assets/admin_banner.png";
import BizumItem from "../dashboard/windows/bizum/components/BizumItem";
import PaymentItem from "../dashboard/windows/history/components/PaymentItem";

const altImage =
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

export default function AdminPage() {
    const {
        getTotalUsers,
        getTotalTransactions,
        getBizumHistorySortedByDate,
        getTotalComission,
        getTotalExchangeBalance,
        getUsersSortedByBalance,
        getCoinsSortedByExchangeVolume,
        getPaymentHistorySortedByDate,
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

    console.log(bizumHistoryByDate);

    return (
        <main className="container mt-4 mb-4">
            <div className="row">
                <div className="col-md-6 mb-4">
                    <img
                        src={Banner}
                        style={{ width: "60%", minWidth: "250px" }}
                        alt="Logo del panel de admin"
                    />
                </div>
                <section className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">
                                Balance total de InfoChange
                            </h2>
                            <p className="card-text h5">
                                {totalExchangeBalance.toFixed(2)}$
                            </p>
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
                            <h2 className="card-title">
                                Ganancias por Comisiones
                            </h2>
                            <p className="card-text h5">
                                {totalCommission.toFixed(2)}$
                            </p>
                        </div>
                    </div>
                </section>
            </div>
            <div className="row mt-4">
                <section className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">
                                Usuarios con Mayor Balance
                            </h2>
                            <div className="card-text">
                                <ul className="list-group list-group-flush">
                                    {usersByBalance.map((user, index) => (
                                        <li
                                            key={index}
                                            className="list-group-item ps-0 pe-0 d-flex align-items-center justify-content-between"
                                        >
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={
                                                        "https://github.com/" +
                                                        user.username +
                                                        ".png"
                                                    }
                                                    className="rounded rounded-5 me-2"
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = altImage;
                                                    }}
                                                    alt={"Logo de " + user.name}
                                                />
                                                <div className="d-flex flex-column">
                                                    <span>{user.username}</span>
                                                    <span
                                                        className="text-secondary"
                                                        style={{
                                                            fontSize: "0.9em",
                                                        }}
                                                    >
                                                        {user.name}{" "}
                                                        {user.lastName}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="fw-bold h5 m-0">
                                                {user.totalBalance.toFixed(2)}$
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">
                                Monedas con Mayor Volumen
                            </h2>
                            <ul className="list-group list-group-flush">
                                {coinsSortedByVolume.map((coin, index) => (
                                    <li
                                        key={index}
                                        className="list-group-item ps-0 pe-0 py-2 m-0"
                                    >
                                        <div className="row d-flex align-items-center justify-content-between">
                                            <div className="col-lg-5 d-flex align-items-center h5 mb-0">
                                                <img
                                                    src={coin.logo}
                                                    alt={"Logo de " + coin.name}
                                                    className="me-2 rounded-4"
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                    }}
                                                />
                                                <div className="fw-bold m-0 me-2">
                                                    {coin.name}:{" "}
                                                </div>
                                            </div>
                                            <div className="col-lg-7 d-flex align-items-center justify-content-lg-end justify-content-start">
                                                <span className="h5 m-0">
                                                    {coin.volume.toFixed(8)}{" "}
                                                    {coin.symbol}
                                                </span>
                                                <span className="h6 text-secondary m-0">
                                                    {" "}
                                                    ~
                                                    {coin.dolar_volume.toFixed(
                                                        2
                                                    )}
                                                    $
                                                </span>
                                            </div>
                                        </div>
                                    </li>
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
                                {bizumHistoryByDate.map((item, index) => {
                                    return (
                                        <BizumItem
                                            sender={item.sender}
                                            receiver={item.receiver}
                                            bizum={item.bizum}
                                            admin={true}
                                        />
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </section>
                <section className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">
                                Depósitos y retiros recientes
                            </h2>
                            <ul className="list-group list-group-flush">
                                {paymentHistory.map((payment, index) => (
                                    <PaymentItem
                                        payment={payment}
                                        user={payment.user}
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
