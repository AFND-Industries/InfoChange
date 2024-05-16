import React from "react";

const BizumItem = ({ user, sender, receiver, bizum, admin = false }) => {
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

    let formattedQuantity = bizum.quantity + "$";
    if (!admin) {
        if (user.profile.ID === sender.id)
            formattedQuantity = <span className="text-danger">-{formattedQuantity}</span>;
        else
            formattedQuantity = <span className="text-success">+{formattedQuantity}</span>;
    }

    return (
        <li key={bizum.id} className="list-group-item px-0">
            <div className="row align-items-center">
                <div className="col-lg-5 d-flex align-items-center mb-3 mb-lg-0">
                    {userDraw(sender)}
                    <i className="bi bi-arrow-right" style={{ fontSize: '1.5em' }}></i>
                </div>
                <div className="col-lg-4 d-flex align-items-center mb-3 mb-lg-0">
                    {userDraw(receiver)}
                </div>
                <div className="col-lg-3 d-flex flex-column align-items-center align-items-lg-end">
                    <span className="fw-bold">{formattedQuantity}</span>
                    <span className="text-secondary text-end" style={{ fontSize: "0.9em" }}>{formattedDate}</span>
                </div>
            </div>
        </li>
    );
}

export default BizumItem;
