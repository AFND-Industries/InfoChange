import React from "react";
import BizumItem from "../../bizum/components/BizumItem";

const BizumHistory = ({ bizumHistory, bizumUsers, user }) => {
    let renderBizumHistory = null;

    const findUserById = (id) => Object.values(bizumUsers).filter(user => user.id == id)[0];

    if (bizumHistory) {
        const sortedHistory = bizumHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

        renderBizumHistory = sortedHistory.map((transaction, index) => {
            const sender = findUserById(transaction.sender);
            const receiver = findUserById(transaction.receiver);

            return <BizumItem user={user} sender={sender} receiver={receiver} bizum={transaction} />
        });
    }

    return (
        <>
            <ul className="list-group">
                {renderBizumHistory}
            </ul>
        </>
    );
}

export default BizumHistory;
