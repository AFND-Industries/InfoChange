import React from "react";

function TradeConfirmationModal() {
    return (
        <div className="modal fade" id="trade-confirmation-modal" aria-labelledby="trade-confirmation-modal-title" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 id="trade-confirmation-modal-title" className="modal-title fs-5">Titulo</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div id="trade-confirmation-modal-body" className="modal-body">
                        Cuerpo
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success" id="trade-confirmation-button">Confirmar</button>
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TradeConfirmationModal;
