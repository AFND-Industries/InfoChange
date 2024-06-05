import React from "react";

const BizumAdminItem = ({ item }) => {
    const altPhoto = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

    const transactionDate = new Date(item.bizum.date);

    const hours = ('0' + transactionDate.getHours()).slice(-2);
    const minutes = ('0' + transactionDate.getMinutes()).slice(-2);
    const day = ('0' + transactionDate.getDate()).slice(-2);
    const month = ('0' + (transactionDate.getMonth() + 1)).slice(-2);
    const year = transactionDate.getFullYear();

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    const userDraw = (user) => (
        <div className="d-flex align-items-center me-3">
            <img
                src={"https://github.com/" + user.username + ".png"}
                className="rounded-circle me-2"
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                onError={(e) => { e.target.src = altPhoto; }}
                alt={"Logo de " + user.name}
            />
            <div className="d-flex flex-column">
                <span>{user.username}</span>
                <span className="text-secondary" style={{ fontSize: "0.9em" }}>{user.name} {user.lastName}</span>
            </div>
        </div>
    );

    let formattedQuantity = item.bizum.quantity + "$";

    return (
        <li className="list-group-item px-0">
            <div className="row align-items-center justify-content-between">
                <div className="col-md-4 col-5 d-flex align-items-center mb-3 mb-sm-0 justify-content-sm-between">
                    {userDraw(item.sender)}
                    <i className="bi bi-arrow-right d-sm-none d-md-block" style={{ fontSize: '1.5em' }}></i>
                </div>
                <div className="col-2 d-md-none d-sm-flex d-none justify-content-center">
                    <i className="bi bi-arrow-right" style={{ fontSize: '1.5em' }}></i>
                </div>
                <div className="col-md-4 col-sm-5 col-12 d-flex align-items-center mb-3 mb-sm-0">
                    {userDraw(item.receiver)}
                </div>
                <div className="col-md-4 d-flex flex-column align-items-center align-items-md-end">
                    <span className="fw-bold">{formattedQuantity}</span>
                    <span className="text-secondary text-end" style={{ fontSize: "0.9em" }}>{formattedDate}</span>
                </div>
            </div>
        </li>
    );
}

export default BizumAdminItem;
