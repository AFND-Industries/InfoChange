import React from "react";

const BizumItem = ({ sender, receiver, bizum }) => {
    const altPhoto = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

    const transactionDate = new Date(bizum.date);

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
                alt="Imagen de usuario"
            />
            <div className="d-flex flex-column">
                <span>{user.username}</span>
                <span className="text-secondary" style={{ fontSize: "0.9em" }}>{user.name} {user.lastName}</span>
            </div>
        </div>
    );

    return (
        <li key={bizum.id} className="list-group-item">
            <div className="row align-items-center">
                <div className="col-md-4 d-flex align-items-center mb-3 mb-md-0">
                    {userDraw(sender)}
                </div>
                <div className="col-md-1 d-flex align-items-center justify-content-center mb-3 mb-md-0">
                    <i className="bi bi-arrow-right" style={{ fontSize: '1.5em' }}></i>
                </div>
                <div className="col-md-4 d-flex align-items-center mb-3 mb-md-0">
                    {userDraw(receiver)}
                </div>
                <div className="col-md-3 d-flex flex-column align-items-center align-items-md-end">
                    <span className="fw-bold">{bizum.quantity}$</span>
                    <span className="text-secondary" style={{ fontSize: "0.9em" }}>{formattedDate}</span>
                </div>
            </div>
        </li>
    );
}

export default BizumItem;
