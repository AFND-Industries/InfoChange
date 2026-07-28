import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import * as Icons from "react-bootstrap-icons";

import BusyOverlay from "../../components/BusyOverlay";
import { useLogin } from "../../hooks/useSession";
import { ApiError } from "../../lib/api";

import "./login.css";

/**
 * Traduce el fallo de la peticion a un aviso para el usuario. `ApiError` ya trae
 * el mensaje redactado en espanol; solo el limite de intentos merece un texto
 * propio, porque conviene explicar que hay que esperar y no volver a probar.
 */
function describeError(error) {
  if (!(error instanceof ApiError)) {
    return {
      variant: "danger",
      message: "No se ha podido iniciar sesión. Inténtalo de nuevo.",
    };
  }

  if (error.code === "TOO_MANY_REQUESTS") {
    return {
      variant: "warning",
      message:
        "Demasiados intentos de acceso. Espera unos minutos antes de volver a intentarlo.",
    };
  }

  return { variant: "danger", message: error.message };
}

/**
 * Devuelve a donde ir despues de entrar. `RequireAuth` guarda en el estado de
 * navegacion la ruta que el usuario intentaba abrir. Se acepta unicamente una
 * ruta interna: un destino con protocolo (o que empiece por "//") permitiria
 * enviar al usuario fuera de la aplicacion desde un enlace preparado.
 */
function safeRedirect(from) {
  return typeof from === "string" && /^\/(?!\/)/.test(from) ? from : "/dashboard";
}

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const login = useLogin();

  // El registro puede enviar aqui el correo recien dado de alta.
  const [identifier, setIdentifier] = useState(() => location.state?.email ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const alert = formError
    ? { variant: "danger", message: formError }
    : login.error
      ? describeError(login.error)
      : null;

  const clearAlert = () => {
    if (formError) setFormError("");
    if (login.error) login.reset();
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const username = identifier.trim();
    if (!username || !password) {
      login.reset();
      setFormError("Introduce tu usuario o correo y tu contraseña.");
      return;
    }

    setFormError("");
    login.mutate(
      { username, password },
      {
        onSuccess: () =>
          navigate(safeRedirect(location.state?.from), { replace: true }),
      },
    );
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
    </Tooltip>
  );

  return (
    <main className="anim_gradient">
      <BusyOverlay show={login.isPending} label="Iniciando sesión..." />

      <div className="container-fluid vh-100 ">
        <div className="row align-items-center justify-content-center vh-100">
          <div className="col-12 col-sm-6 col-lg-4  d-flex flex-column justify-content-center">
            <div className="card text-center p-md-4 p-0">
              <div className="card-body">
                <h1 className="text-secondary card-title mb-4 fs-2">
                  Iniciar sesión
                </h1>

                <form onSubmit={onSubmit} noValidate>
                  <div className="mb-3 text-start">
                    <label htmlFor="userInput" className="form-label">
                      Usuario o correo electrónico
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={identifier}
                      id="userInput"
                      name="username"
                      autoComplete="username"
                      placeholder="usuario o correo@ejemplo.com"
                      aria-required="true"
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        clearAlert();
                      }}
                    />
                  </div>
                  <div className="mb-4 text-start">
                    <label htmlFor="passInput" className="form-label">
                      Contraseña
                    </label>

                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        value={password}
                        id="passInput"
                        name="password"
                        autoComplete="current-password"
                        aria-required="true"
                        onChange={(e) => {
                          setPassword(e.target.value);
                          clearAlert();
                        }}
                      />
                      <OverlayTrigger
                        placement="top"
                        delay={{
                          show: 250,
                          hide: 400,
                        }}
                        overlay={renderTooltip}
                      >
                        <button
                          type="button"
                          className="btn btn-dark"
                          name="showPassword"
                          aria-label={
                            showPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
                          }
                          onClick={() => setShowPassword((visible) => !visible)}
                        >
                          {showPassword ? <Icons.Eye /> : <Icons.EyeSlash />}
                        </button>
                      </OverlayTrigger>
                    </div>
                  </div>

                  {alert ? (
                    <Alert
                      variant={alert.variant}
                      dismissible
                      closeLabel="Cerrar alerta"
                      onClose={clearAlert}
                    >
                      <div>{alert.message}</div>
                    </Alert>
                  ) : null}

                  <div className="d-flex justify-content-center my-3">
                    <Link to={"/"}>
                      <button
                        type="button"
                        className="btn btn-outline-secondary mx-2"
                      >
                        Volver a inicio
                      </button>
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary mx-2"
                      disabled={login.isPending}
                    >
                      Entrar
                    </button>
                  </div>
                </form>

                <p className="mb-0 fs-6">
                  ¿Aún no tienes una cuenta?
                  <br />
                  <Link to={"/register"} style={{ textDecoration: "none" }}>
                    ¡Regístrate ahora pulsando sobre este enlace!
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
