import React from "react";

const altImage =
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

const UserBalanceItem = ({ user }) => {
    return (
        <li className="list-group-item ps-0 pe-0 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
                <img
                    src={"https://github.com/" + user.username + ".png"}
                    className="rounded rounded-5 me-2"
                    style={{ width: "50px", height: "50px" }}
                    onError={(e) => {
                        e.target.src = altImage;
                    }}
                    alt={"Logo de " + user.firstName}
                />
                <div className="d-flex flex-column">
                    <span>{user.username}</span>
                    <span
                        className="text-secondary"
                        style={{ fontSize: "0.9em" }}
                    >
                        {user.firstName} {user.lastName}
                    </span>
                </div>
            </div>
            <span className="fw-bold h5 m-0">
                {user.totalBalance.toFixed(2)}$
            </span>
        </li>
    );
};

export default UserBalanceItem;
