import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

import Banner from "../../assets/admin_banner.png";
import { useAdminOverview } from "../../hooks/useHistory";
import { formatUsd } from "../../lib/format";

import SummaryCard from "./components/SummaryCard";
import UserBalanceList from "./components/UserBalanceList";
import CoinVolumeList from "./components/CoinVolumeList";
import BizumList from "./components/BizumList";
import PaymentList from "./components/PaymentList";

function AdminBanner() {
    return (
        <header className="text-center mb-4">
            <img src={Banner} className="img-fluid col-lg-6 col-md-8 col-sm-11 col-10" alt="Logo del panel de admin" />
        </header>
    );
}

export default function AdminPage() {
    const { data, isPending, error } = useAdminOverview();

    if (isPending) {
        return (
            <div className="container my-4">
                <AdminBanner />
                <div className="d-flex justify-content-center align-items-center">
                    <Spinner animation="border" style={{ width: "70px", height: "70px" }} role="status" />
                    <span className="ms-4 h1">Cargando información...</span>
                </div>
            </div>
        );
    }

    // Solo se sustituye el panel si no hay nada que mostrar: un fallo en un
    // refresco periodico no debe borrar las metricas que ya estan en pantalla.
    if (!data) {
        return (
            <div className="container my-4">
                <AdminBanner />
                <Alert variant="danger" className="text-center">
                    <Alert.Heading className="h5">No se han podido cargar las métricas</Alert.Heading>
                    <p className="mb-0">{error?.message}</p>
                </Alert>
            </div>
        );
    }

    const { totals, topUsers, topAssets, recentTransfers, recentPayments } = data;

    return (
        <main className="container my-4">
            <AdminBanner />

            <div className="row mb-4">
                <SummaryCard title="Usuarios registrados" value={totals.users} />
                <SummaryCard title="Balance total de InfoChange" value={formatUsd(totals.balanceUsd)} />
                <SummaryCard title="Trades realizados" value={totals.trades} />
                <SummaryCard title="Ganancias por comisiones" value={formatUsd(totals.feesUsd)} />
            </div>
            <div className="row mb-4">
                <UserBalanceList users={topUsers} />
                <PaymentList payments={recentPayments} />
            </div>
            <div className="row mb-4">
                <BizumList items={recentTransfers} />
                <CoinVolumeList coins={topAssets} />
            </div>
        </main>
    );
}
