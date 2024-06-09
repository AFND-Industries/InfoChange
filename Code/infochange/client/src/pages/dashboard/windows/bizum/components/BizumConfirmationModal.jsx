import React from "react";

function BizumConfirmationModal() {
    return (
        <div className="modal fade" id="bizum-confirmation-modal" aria-labelledby="bizum-confirmation-modal-title" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 id="bizum-confirmation-modal-title" className="modal-title fs-5">Titulo</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div id="bizum-confirmation-modal-body" className="modal-body">
                        Cuerpo
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success" id="bizum-confirmation-button">Confirmar</button>
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BizumConfirmationModal;
