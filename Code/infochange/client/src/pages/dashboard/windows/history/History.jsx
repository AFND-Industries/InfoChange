import React, { useState } from "react";

import TradeHistory from "./components/TradeHistory";
import PaymentHistory from "./components/PaymentHistory";
import BizumHistory from "./components/BizumHistory";

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function History({ user, tradeHistory, bizumHistory, paymentHistory, bizumUsers }) {
    const [historyMode, setHistoryMode] = useState(0);

    const HistoryComponent = historyMode === 0 ? TradeHistory : (historyMode === 1 ? PaymentHistory : BizumHistory);

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFont("times", "normal");
        doc.setFontSize(12);

        doc.text("Reporte de Historial de Intercambios", 14, 16);
        doc.autoTable({
            startY: 20,
            head: [['ID', 'Símbolo', 'Tipo', 'Monto Pagado', 'Monto Recibido', 'Comisión', 'Fecha', 'Precio']],
            body: tradeHistory.map(trade => [
                trade.id,
                trade.symbol,
                trade.type,
                trade.paid_amount,
                trade.amount_received,
                trade.comission,
                new Date(trade.date).toLocaleString(),
                trade.price
            ])
        });

        /*doc.addPage();
        doc.text("Historial de Pagos y Retiros", 14, 16);
        doc.autoTable({
            startY: 20,
            head: [['ID', 'Remitente', 'Receptor', 'Cantidad', 'Fecha']],
            body: bizumHistory.map(bizum => [
                bizum.id,
                bizum.sender,
                bizum.receiver,
                bizum.quantity,
                new Date(bizum.date).toLocaleString()
            ])
        });*/

        doc.addPage();
        doc.text("Historial de Bizums", 14, 16);
        doc.autoTable({
            startY: 20,
            head: [['ID', 'Remitente', 'Receptor', 'Cantidad', 'Fecha']],
            body: bizumHistory.map(bizum => [
                bizum.id,
                bizum.sender,
                bizum.receiver,
                bizum.quantity,
                new Date(bizum.date).toLocaleString()
            ])
        });

        doc.save('informe.pdf');
    };

    return (
        <>
            <div className="row px-5 pt-4">
                <div className="row justify-content-end p-0 mb-2">
                    <div className="col d-flex justify-content-end p-0">
                        <button className="btn btn-primary" onClick={generatePDF}>
                            Descargar informe <i class="ms-2 bi bi-download"></i>
                        </button>
                    </div>
                </div>
                <div className="col d-flex justify-content-center align-items-center flex-md-row flex-column">
                    <ul className="nav nav-tabs nav-justified w-100" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className={`nav-link ${historyMode === 0 ? "active bg-primary text-white" : "text-dark"}`}
                                id="intercambios-tab"
                                type="button"
                                role="tab"
                                aria-controls="intercambios-tab-pane"
                                aria-selected={historyMode === 0}
                                onClick={() => setHistoryMode(0)}>
                                Intercambios
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className={`nav-link ${historyMode === 1 ? "active bg-primary text-white" : "text-dark"}`}
                                id="pagos-retiros-tab"
                                type="button"
                                role="tab"
                                aria-controls="pagos-retiros-tab-pane"
                                aria-selected={historyMode === 1}
                                onClick={() => setHistoryMode(1)}>
                                Pagos y Retiros
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className={`nav-link ${historyMode === 2 ? "active bg-primary text-white" : "text-dark"}`}
                                id="bizums-tab"
                                type="button"
                                role="tab"
                                aria-controls="bizums-tab-pane"
                                aria-selected={historyMode === 2}
                                onClick={() => setHistoryMode(2)}>
                                Bizums
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="row px-5 py-4">
                <div className="col">
                    <HistoryComponent
                        tradeHistory={tradeHistory}
                        bizumHistory={bizumHistory}
                        paymentHistory={paymentHistory}
                        bizumUsers={bizumUsers}
                        user={user}
                    />
                </div>
            </div>
        </>
    );
}
