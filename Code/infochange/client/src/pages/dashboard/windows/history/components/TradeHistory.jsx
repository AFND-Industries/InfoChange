import { useAPI } from "../../../../../context/APIContext";

export default function TradeHistory({ tradeHistory }) {
    const { getPair } = useAPI();

    let renderTradeHistory = null;

    if (tradeHistory) {
        const sortedHistory = tradeHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

        renderTradeHistory = sortedHistory.map((trade, index) => {
            const symbol = getPair(trade.symbol);

            const tradeDate = new Date(trade.date);

            const hours = ('0' + tradeDate.getHours()).slice(-2);
            const minutes = ('0' + tradeDate.getMinutes()).slice(-2);
            const day = ('0' + tradeDate.getDate()).slice(-2);
            const month = ('0' + (tradeDate.getMonth() + 1)).slice(-2);
            const year = tradeDate.getFullYear();

            const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

            return (
                <tr key={index}>
                    <td><b>{trade.symbol}</b></td>
                    <td>{trade.type === "BUY" ?
                        <b className="text-success">COMPRA</b> :
                        <b className="text-danger">VENTA</b>}</td>
                    <td>{trade.paid_amount.toFixed(8) + " " + (trade.type === "BUY" ? symbol.quoteAsset : symbol.baseAsset)}</td>
                    <td>{trade.amount_received.toFixed(8) + " " + (trade.type === "BUY" ? symbol.baseAsset : symbol.quoteAsset)}</td>
                    <td>{trade.comission.toFixed(8) + " " + (trade.type === "BUY" ? symbol.quoteAsset : symbol.baseAsset)}</td>
                    <td>{formattedDate}</td>
                    <td>{trade.price}</td>
                </tr>
            );
        });
    }

    return (
        <>
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
        </>
    );
}
