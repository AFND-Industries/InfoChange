import React from "react";

function ServerNotAvailable() {
    console.log("Servidor no disponible...");

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-danger flex-column">
            <div className="alert alert-danger">
                <span className="h1">SERVIDOR NO DISPONIBLE</span>
            </div>
            <span className="alert alert-danger">
                (Si estás desarrollando, ve a main.jsx y pon un "1" en el setStatus de
                catch Exception para arreglarlo)
            </span>
        </div>
    );
}

export default ServerNotAvailable;