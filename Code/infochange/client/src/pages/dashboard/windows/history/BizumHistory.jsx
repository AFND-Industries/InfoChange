import React from "react";

const BizumHistory = ({ bizumHistory, bizumUsers }) => {
    let renderBizumHistory = null;

    if (bizumHistory) {
        const sortedHistory = bizumHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

        renderBizumHistory = sortedHistory.map((transaction, index) => {
            const transactionDate = new Date(transaction.date);

            const hours = ('0' + transactionDate.getHours()).slice(-2);
            const minutes = ('0' + transactionDate.getMinutes()).slice(-2);
            const day = ('0' + transactionDate.getDate()).slice(-2);
            const month = ('0' + (transactionDate.getMonth() + 1)).slice(-2);
            const year = transactionDate.getFullYear();

            const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

            return (
                <tr key={index}>
                    <td><b>{transaction.sender}</b></td>
                    <td>{transaction.receiver}</td>
                    <td>{transaction.quantity}</td>
                    <td>{formattedDate}</td>
                </tr>
            );
        });
    }

    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th>Remitente</th>
                        <th>Receptor</th>
                        <th>Cantidad</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {renderBizumHistory}
                </tbody>
            </table>
        </>
    );
}

export default BizumHistory;
