import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { formatUsd } from "../../../../../lib/format";

/**
 * Confirmacion de una transferencia.
 *
 * Antes era un `div.modal` vacio al que se le escribia el titulo y el cuerpo
 * con `innerHTML`, y al que se le enganchaba el `onclick` del boton buscando el
 * elemento por su identificador. Ahora recibe lo que tiene que ensenar.
 */
export default function BizumConfirmationModal({
  show,
  onHide,
  recipient,
  amount,
  onConfirm,
}) {
  return (
    <Modal show={show} onHide={onHide} aria-labelledby="bizum-confirmation-modal-title">
      <Modal.Header closeButton>
        <Modal.Title
          as="h1"
          id="bizum-confirmation-modal-title"
          className="fs-5"
        >
          ¿Estás seguro de que quieres hacer un Bizum?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Estás a punto de hacer un <b>bizum</b> de <b>{formatUsd(amount)}</b> a{" "}
        <b>{recipient?.username}</b>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={onConfirm}>
          Confirmar
        </Button>
        <Button variant="danger" onClick={onHide}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
