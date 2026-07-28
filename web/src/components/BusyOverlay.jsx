import Spinner from "react-bootstrap/Spinner";

/**
 * Velo de "operacion en curso".
 *
 * Sustituye al antiguo `LoadingScreen`, que se mostraba y se ocultaba desde
 * cuatro pantallas distintas con
 * `document.getElementById("loading-screen").style.display = ...`. Al depender
 * de un elemento global, bastaba con que una operacion fallase antes de tiempo
 * para dejar la pantalla bloqueada. Ahora se controla con una prop, de modo que
 * su estado no puede desincronizarse del de la operacion.
 */
export default function BusyOverlay({ show, label = "Procesando..." }) {
  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center gap-3"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999 }}
      role="status"
      aria-live="polite"
    >
      <Spinner animation="border" variant="light" style={{ width: 72, height: 72 }} />
      <span className="text-white fs-5">{label}</span>
    </div>
  );
}
