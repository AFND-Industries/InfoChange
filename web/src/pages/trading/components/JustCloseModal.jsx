import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

/** Aviso de un solo boton: se muestra y se cierra, sin decisiones que tomar. */
function JustCloseModal({ show, title, body, onHide }) {
    return (
        <Modal show={show} onHide={onHide} aria-labelledby="just-close-modal-title">
            <Modal.Header closeButton>
                <Modal.Title as="h1" id="just-close-modal-title" className="fs-5">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onHide}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default JustCloseModal;
