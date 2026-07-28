import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import { Navigate, useLocation } from "react-router-dom";

import { useSession } from "../hooks/useSession";

export function FullPageSpinner({ label = "Cargando..." }) {
  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center gap-3"
      style={{ minHeight: "60vh" }}
    >
      <Spinner animation="border" role="status" variant="primary" />
      <p className="text-muted mb-0">{label}</p>
    </Container>
  );
}

export function ServerUnavailable() {
  return (
    <Container className="py-5" style={{ maxWidth: "40rem" }}>
      <Alert variant="warning">
        <Alert.Heading>No se puede conectar con el servidor</Alert.Heading>
        <p className="mb-3">
          La aplicacion no ha podido contactar con la API. Puede tratarse de un
          corte momentaneo de conexion.
        </p>
        <Button variant="outline-dark" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </Alert>
    </Container>
  );
}

/**
 * Guardias de ruta.
 *
 * Antes el control de acceso al panel de administracion consistia en comprobar
 * que el nombre de pila del usuario fuese "admin", y solo en el cliente. Ahora
 * el rol viene del servidor, que ademas lo vuelve a comprobar en cada peticion:
 * esto es unicamente para no ensenar una pantalla que va a fallar.
 */
export function RequireAuth({ children }) {
  const { status } = useSession();
  const location = useLocation();

  if (status === "loading") return <FullPageSpinner />;
  if (status === "offline") return <ServerUnavailable />;
  if (status === "anonymous") {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export function RequireAdmin({ children }) {
  const { status, isAdmin } = useSession();

  if (status === "loading") return <FullPageSpinner />;
  if (status === "offline") return <ServerUnavailable />;
  if (status === "anonymous") return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}

/** Para paginas publicas que igualmente necesitan datos de la API. */
export function RequireBackend({ children }) {
  const { status } = useSession();

  if (status === "loading") return <FullPageSpinner />;
  if (status === "offline") return <ServerUnavailable />;

  return children;
}

/** Login y registro: si ya hay sesion, no tiene sentido mostrarlos. */
export function RedirectIfAuthenticated({ children }) {
  const { status } = useSession();

  if (status === "loading") return <FullPageSpinner />;
  if (status === "authenticated") return <Navigate to="/dashboard" replace />;

  return children;
}
