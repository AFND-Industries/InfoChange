import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

/**
 * Confirmacion previa a una operacion.
 *
 * Antes era marcado estatico que `BuyAndSell` rellenaba con `innerHTML` y
 * ensenaba con `new bootstrap.Modal(...)`, ademas de reasignar el `onclick` del
 * boton en cada apertura. Ahora el contenido llega por props y React se encarga
 * de escaparlo.
 */
function TradeConfirmationModal({ show, title, body, onConfirm, onHide }) {
    return (
        <Modal show={show} onHide={onHide} aria-labelledby="trade-confirmation-modal-title">
            <Modal.Header closeButton>
                <Modal.Title as="h1" id="trade-confirmation-modal-title" className="fs-5">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={onConfirm} autoFocus>Confirmar</Button>
                <Button variant="danger" onClick={onHide}>Cancelar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TradeConfirmationModal;
