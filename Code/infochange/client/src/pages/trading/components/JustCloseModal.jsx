import React from "react";

function JustCloseModal() {
    return (
        <div className="modal fade" id="just-close-modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 id="just-close-modal-title" className="modal-title fs-5">Titulo</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div id="just-close-modal-body" className="modal-body">
                        Cuerpo
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JustCloseModal;