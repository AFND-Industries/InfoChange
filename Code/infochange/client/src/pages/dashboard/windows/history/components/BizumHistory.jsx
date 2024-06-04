import React from "react";
import BizumItem from "../../bizum/components/BizumItem";

const BizumHistory = ({ bizumHistory, bizumUsers, user }) => {
    const findUserById = (id) =>
        bizumUsers.find((user) => {
            console.log(user);
            return user.ID === id;
        });

    const renderBizumHistory = bizumHistory ? (
        bizumHistory
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((transaction, index) => {
                const sender = findUserById(transaction.sender);
                const receiver = findUserById(transaction.receiver);

                console.log(sender);

                return (
                    <BizumItem
                        key={index}
                        user={user}
                        sender={sender}
                        receiver={receiver}
                        bizum={transaction}
                    />
                );
            })
    ) : (
        <b>No se han encontrado resultados :(</b>
    );

    return (
        <>
            <ul className="list-group list-group-flush p-0 m-0">
                {renderBizumHistory.length === 0 ? (
                    <li className="list-group-item text-center">
                        <b className="fs-5">
                            No se han encontrado resultados :(
                        </b>
                    </li>
                ) : (
                    renderBizumHistory
                )}
            </ul>
        </>
    );
};

export default BizumHistory;
