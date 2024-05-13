export default function History({ history }) {
    let renderTradeHistory = null;

    if (history) {
        renderTradeHistory = history.map((trade, index) => {
            const tradeDate = new Date(trade.date);

            const hours = ('0' + tradeDate.getHours()).slice(-2);
            const minutes = ('0' + tradeDate.getMinutes()).slice(-2);
            const day = ('0' + tradeDate.getDate()).slice(-2);
            const month = ('0' + (tradeDate.getMonth() + 1)).slice(-2);
            const year = tradeDate.getFullYear();

            const formattedDate = `${hours}:${minutes} ${day}/${month}/${year}`;

            return (
                <tr key={index}>
                    <td>{trade.symbol}</td>
                    <td>{trade.type}</td>
                    <td>{trade.paid_amount.toFixed(8)}</td>
                    <td>{trade.amount_received.toFixed(8)}</td>
                    <td>{trade.comission.toFixed(8)}</td>
                    <td>{formattedDate}</td>
                    <td>{trade.price}</td>
                </tr>
            );
        });
    }

    return (
        <>
            <div className="row px-5 py-4">
                <div className="col">
                    <h2 className="text-center">Historial de Trades</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Símbolo</th>
                                <th>Tipo</th>
                                <th>Cantidad Pagada</th>
                                <th>Cantidad Recibida</th>
                                <th>Comisión</th>
                                <th>Fecha</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTradeHistory}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
