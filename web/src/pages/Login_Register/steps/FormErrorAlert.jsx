import { useState } from "react";
import Alert from "react-bootstrap/Alert";

/**
 * Aviso de "hay campos por revisar".
 *
 * La version anterior lo construia concatenando HTML y lo insertaba con
 * `innerHTML` en un hueco buscado por id, de modo que cada intento de envio
 * apilaba un aviso mas y los tres pasos compartian el mismo identificador.
 */
export default function FormErrorAlert({ submitCount, errors }) {
  const [dismissedAt, setDismissedAt] = useState(0);

  const hasErrors = Object.keys(errors).length > 0;
  if (!hasErrors || submitCount === 0 || dismissedAt === submitCount) return null;

  return (
    <Alert
      variant="danger"
      dismissible
      onClose={() => setDismissedAt(submitCount)}
      closeLabel="Cerrar alerta"
    >
      Por favor, revise los campos erroneos
    </Alert>
  );
}
