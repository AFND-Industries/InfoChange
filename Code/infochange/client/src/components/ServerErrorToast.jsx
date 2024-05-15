import React from "react";

export default function ServerErrorToast() {
    return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div
                id="liveToast"
                className="toast"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                <div className="toast-header">
                    <div
                        className="rounded me-2"
                        style={{
                            backgroundColor: "red",
                            width: "20px",
                            height: "20px",
                        }}
                    ></div>
                    <strong className="me-auto">Error</strong>
                    <small>¡IMPORTANTE!</small>
                    {false && (
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="toast"
                            aria-label="Close"
                        ></button>
                    )}
                </div>
                <div className="toast-body">
                    El servidor no está disponible en estos momentos.
                </div>
            </div>
        </div>
    );
}