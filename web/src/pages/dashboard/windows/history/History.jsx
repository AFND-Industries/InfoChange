import { useCallback, useMemo, useState } from "react";
import Spinner from "react-bootstrap/Spinner";

import {
  usePaymentHistory,
  useTradeHistory,
  useTransferHistory,
} from "../../../../hooks/useHistory";
import { useSession } from "../../../../hooks/useSession";
import { useRecipients } from "../../../../hooks/useWallet";
import {
  formatAsset,
  formatDateTime,
  formatPrice,
  formatUsd,
} from "../../../../lib/format";
import { useToast } from "../../../../providers/ToastProvider";
import BizumHistory from "./components/BizumHistory";
import PaymentHistory from "./components/PaymentHistory";
import TradeHistory from "./components/TradeHistory";

const TABS = [
  { id: "intercambios-tab", label: "Intercambios" },
  { id: "pagos-retiros-tab", label: "Pagos y Retiros" },
  { id: "bizums-tab", label: "Bizums" },
];

export default function History() {
  const [showItems, setShowItems] = useState(5);
  const [historyMode, setHistoryMode] = useState(0);
  const [buildingReport, setBuildingReport] = useState(false);
  const toast = useToast();

  const trades = useTradeHistory();
  const payments = usePaymentHistory();
  const transfers = useTransferHistory();

  const { user } = useSession();
  const { data: recipients } = useRecipients("");

  // La API devuelve identificadores; los nombres se resuelven con el listado de
  // destinatarios. Si alguno no esta disponible se ensena el identificador.
  const directory = useMemo(() => {
    const map = new Map();
    if (user) map.set(user.id, user);
    for (const person of recipients ?? []) map.set(person.id, person);
    return map;
  }, [recipients, user]);

  const nameOf = useCallback(
    (id) => directory.get(id)?.username ?? `#${id}`,
    [directory],
  );

  const queries = [trades, payments, transfers];
  const activeQuery = queries[historyMode];
  const activeItems = activeQuery.data ?? [];

  const reportReady = queries.every((query) => query.data !== undefined);

  const selectTab = (mode) => {
    setHistoryMode(mode);
    setShowItems(5);
  };

  /**
   * `jspdf` y su complemento de tablas pesan cerca de un megabyte. Se cargan
   * aqui, al pulsar, en vez de en el paquete de la aplicacion: quien nunca
   * descarga el informe tampoco descarga la libreria.
   */
  const generatePDF = async () => {
    setBuildingReport(true);

    try {
      // Desde la version 5, jspdf-autotable ya no anade `autoTable` al
      // prototipo de jsPDF: hay que llamar a la funcion pasandole el documento.
      const [{ jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      const doc = new jsPDF();

      const titleStyle = {
        fontSize: 18,
        fontStyle: "bold",
        textColor: [34, 34, 34],
      };

      const tableStyle = {
        startY: 20,
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: { textColor: [34, 34, 34], halign: "center" },
      };

      doc.text("Reporte de Historial de Intercambios", 105, 10, {
        align: "center",
        ...titleStyle,
      });
      autoTable(doc, {
        ...tableStyle,
        head: [
          [
            "ID",
            "Símbolo",
            "Tipo",
            "Monto Pagado",
            "Monto Recibido",
            "Comisión",
            "Fecha",
            "Precio",
          ],
        ],
        body: (trades.data ?? []).map((trade) => [
          trade.id,
          trade.symbol,
          trade.side === "BUY" ? "Compra" : "Venta",
          `${formatAsset(trade.paidAmount)} ${trade.paidAsset}`,
          `${formatAsset(trade.receivedAmount)} ${trade.receivedAsset}`,
          `${formatAsset(trade.fee)} ${trade.paidAsset}`,
          formatDateTime(trade.executedAt),
          formatPrice(trade.price),
        ]),
      });

      doc.addPage();

      doc.text("Historial de Pagos y Retiros", 105, 10, {
        align: "center",
        ...titleStyle,
      });
      autoTable(doc, {
        ...tableStyle,
        head: [
          [
            "ID",
            "Tipo",
            "Método",
            "Información de la operación",
            "Cantidad",
            "Fecha",
          ],
        ],
        body: (payments.data ?? []).map((payment) => [
          payment.id,
          payment.kind === "DEPOSIT" ? "Ingreso" : "Retirada",
          payment.method,
          payment.methodReference ?? "-",
          formatUsd(payment.amount),
          formatDateTime(payment.createdAt),
        ]),
      });

      doc.addPage();

      doc.text("Historial de Bizums", 105, 10, {
        align: "center",
        ...titleStyle,
      });
      autoTable(doc, {
        ...tableStyle,
        head: [["ID", "Remitente", "Receptor", "Cantidad", "Fecha"]],
        body: (transfers.data ?? []).map((bizum) => [
          bizum.id,
          nameOf(bizum.senderId),
          nameOf(bizum.recipientId),
          formatUsd(bizum.amount),
          formatDateTime(bizum.createdAt),
        ]),
      });

      doc.save("informe.pdf");
    } catch (error) {
      toast.error("No se ha podido generar el informe", error.message);
    } finally {
      setBuildingReport(false);
    }
  };

  return (
    <>
      <div className="row px-5 pt-4">
        <div className="row p-0 mb-2 ps-3">
          <div className="col d-flex justify-content-center justify-content-sm-end p-0">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!reportReady || buildingReport}
              onClick={generatePDF}
            >
              Descargar informe <i className="ms-2 bi bi-download"></i>
            </button>
          </div>
        </div>
        <div className="col d-flex justify-content-center align-items-center flex-md-row flex-column">
          <ul
            className="nav nav-tabs nav-justified w-100"
            id="myTab"
            role="tablist"
          >
            {TABS.map((tab, mode) => (
              <li key={tab.id} className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    historyMode === mode
                      ? "active bg-primary text-white"
                      : "text-dark"
                  }`}
                  id={tab.id}
                  type="button"
                  role="tab"
                  aria-controls="myTab"
                  aria-selected={historyMode === mode}
                  onClick={() => selectTab(mode)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="row px-5 py-4 d-flex flex-column">
        <div className="col">
          {activeQuery.isPending ? (
            <div className="d-flex justify-content-center py-4">
              <Spinner animation="border" role="status" variant="primary" />
            </div>
          ) : activeQuery.error ? (
            <div className="alert alert-danger mb-0 text-center">
              {activeQuery.error.message}
            </div>
          ) : historyMode === 0 ? (
            <TradeHistory trades={activeItems} showItems={showItems} />
          ) : historyMode === 1 ? (
            <PaymentHistory payments={activeItems} showItems={showItems} />
          ) : (
            <BizumHistory
              transfers={activeItems}
              showItems={showItems}
              directory={directory}
              currentUserId={user?.id}
            />
          )}
        </div>
        {showItems < activeItems.length && (
          <div className="col d-flex justify-content-center mt-3">
            <button
              type="button"
              className="btn btn-primary w-50"
              onClick={() => setShowItems((items) => items + 5)}
            >
              Mostrar más
            </button>
          </div>
        )}
      </div>
    </>
  );
}
