import React from "react";
import UserBalanceItem from "./UserBalanceItem";

const UserBalanceList = ({ users }) => (
    <div className="col-md-12 col-lg-4">
        <div className="card shadow-sm h-100" role="region" aria-labelledby="user-balance-list" tabIndex="0">
            <div className="card-body">
                <h2 id="user-balance-list" className="card-title h5">Usuarios con más balance</h2>
                <ul className="list-group list-group-flush">
                    {users.map((user, index) => (
                        <UserBalanceItem key={index} user={user} />
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

export default UserBalanceList;
