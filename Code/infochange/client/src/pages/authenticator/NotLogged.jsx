import React from "react";

function NotLogged() {
    console.log("¡No has iniciado sesión!");

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 flex-column">
            <div className="alert alert-danger">
                <span className="h1">Usuario no autenticado</span>
                <br />
            </div>
            <span>
                (Aquí habría que en vez de enseñar esto, redirigir a Welcome o a Login)
            </span>
        </div>
    );
}

export default NotLogged;