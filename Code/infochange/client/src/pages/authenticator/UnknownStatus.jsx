import React from "react";

function UnknownStatus({ status }) {
    console.log("Status desconocido: " + status);

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 flex-column">
            <div className="alert alert-danger">
                <span className="h1">
                    Algo ha salido mal... Estado desconocido: {status}
                </span>
            </div>
            <span>
                (Contacta con el administrador y envíale una captura de esta pantalla)
            </span>
        </div>
    );
}

export default UnknownStatus;