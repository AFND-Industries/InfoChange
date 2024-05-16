import React from "react";
import BizumItem from "../../bizum/components/BizumItem";

const BizumHistory = ({ bizumHistory, bizumUsers, user }) => {
    const findUserById = (id) => bizumUsers.find(user => user.id === id);

    const renderBizumHistory = bizumHistory
        ? bizumHistory
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((transaction, index) => {
                const sender = findUserById(transaction.sender);
                const receiver = findUserById(transaction.receiver);

                return <BizumItem key={index} user={user} sender={sender} receiver={receiver} bizum={transaction} />;
            })
        : null;

    return (
        <>
            <ul className="list-group list-group-flush p-0 m-0">
                {renderBizumHistory}
            </ul>
        </>
    );
}

export default BizumHistory;
