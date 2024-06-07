import React from "react";

function ReceivedBizumToast() {
    return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div
                id="received-bizum-toast"
                className="toast"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                <div className="toast-header">
                    <div
                        className="rounded me-2"
                        style={{
                            backgroundColor: "green",
                            width: "20px",
                            height: "20px",
                        }}
                    ></div>
                    <strong id="received-bizum-toast-title" className="me-auto">Titulo</strong>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="toast"
                        aria-label="Close"
                    ></button>
                </div>
                <div id="received-bizum-toast-body" className="toast-body">
                    Cuerpo
                </div>
            </div>
        </div>
    );
}

export default ReceivedBizumToast;