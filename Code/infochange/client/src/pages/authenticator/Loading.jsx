import React from "react";

function Loading() {
    console.log("Cargando...");

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 flex-column">
            <div className="alert alert-secondary">
                <span className="h1">Autenticando usuario...</span>
            </div>
        </div>
    );
}

export default Loading;