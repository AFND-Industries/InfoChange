import React from "react";

import Banner from "../../assets/admin_banner.png";
import { useAdmin } from "./context/AdminContext";

import SummaryCard from "./components/SummaryCard";
import UserBalanceList from "./components/UserBalanceList";
import CoinVolumeList from "./components/CoinVolumeList";
import BizumList from "./components/BizumList";
import PaymentList from "./components/PaymentList";

export default function AdminPage() {
    const {
        getAdminInfo,
        getTotalUsers,
        getTotalTransactions,
        getBizumHistorySortedByDate,
        getTotalComission,
        getTotalExchangeBalance,
        getUsersSortedByBalance,
        getCoinsSortedByExchangeVolume,
        getPaymentHistorySortedByDate
    } = useAdmin();

    const infoLoaded = getAdminInfo() !== undefined;

    const totalUsers = getTotalUsers();
    const totalTransactions = getTotalTransactions();
    const totalCommission = getTotalComission();
    const totalExchangeBalance = getTotalExchangeBalance();

    const bizumHistoryByDate = getBizumHistorySortedByDate();
    const usersByBalance = getUsersSortedByBalance();
    const coinsSortedByVolume = getCoinsSortedByExchangeVolume();
    const paymentHistory = getPaymentHistorySortedByDate();

    const loadingPanel = (
        <div className="container my-4">
            <header className="text-center mb-4">
                <img src={Banner} className="img-fluid col-lg-6 col-md-8 col-sm-11 col-10" alt="Logo del panel de admin" />
            </header>
            <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-border" style={{ width: "70px", height: "70px" }} role="status"></div>
                <span className="ms-4 h1">Cargando información...</span>
            </div>
        </div>
    );

    const adminPanel = (
        <main className="container my-4">
            <header className="text-center mb-4">
                <img src={Banner} className="img-fluid col-lg-6 col-md-8 col-sm-11 col-10" alt="Logo del panel de admin" />
            </header>

            <div className="row mb-4">
                <SummaryCard title="Usuarios registrados" value={totalUsers} />
                <SummaryCard title="Balance total de InfoChange" value={`${totalExchangeBalance.toFixed(2)}$`} />
                <SummaryCard title="Trades realizados" value={totalTransactions} />
                <SummaryCard title="Ganancias por comisiones" value={`${totalCommission.toFixed(2)}$`} />
            </div>
            <div className="row mb-4">
                <UserBalanceList users={usersByBalance} />
                <PaymentList payments={paymentHistory} />
            </div>
            <div className="row mb-4">
                <BizumList items={bizumHistoryByDate} />
                <CoinVolumeList coins={coinsSortedByVolume} />
            </div>
        </main>
    );

    return infoLoaded ? adminPanel : loadingPanel;
}
