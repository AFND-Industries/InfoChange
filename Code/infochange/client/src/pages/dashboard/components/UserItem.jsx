import React from "react";
import "./UserItem.css";

function UserItem({ user, onClick }) {
    const altPhoto = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

    return (
        <li key={user.id} onClick={onClick}>
            <a className="user-item d-flex align-items-center">
                <img src={"https://github.com/" + user.username + ".png"} className="rounded rounded-5 me-2"
                    style={{ width: '50px', height: '50px' }} onError={(e) => { e.target.src = altPhoto; }} alt="Imagen del usuario" />
                <div className="d-flex flex-column">
                    <span>{user.username}</span>
                    <span className="text-secondary" style={{ fontSize: "0.9em" }}>{user.name} {user.lastName}</span>
                </div>
            </a>
        </li >
    )
}

export default UserItem;