import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import * as Icons from "react-bootstrap-icons";

import { useAuth } from "../authenticator/AuthContext";

import "./login.css";

function Login() {
  const location = useLocation();
  const { doLogin, getAuthStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (getAuthStatus() !== "0")
      navigate("/");
  }, [getAuthStatus()]);

  onkeydown = (e) => {
    if (e.code === "Enter") onLogin();
  };

  const user = useRef("");
  const pass = useRef("");

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState("password");

  const [Fuser, setUser] = useState("");
  const handleUserChange = (value) => {
    // Actualiza el estado con el nuevo valor
    setUser(value);
  };
  useEffect(() => {
    let email = location.state !== null ? location.state.email : "";
    setUser(email);
  }, []);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setInputType(showPassword ? "password" : "text");
  };
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
    </Tooltip>
  );
  const onLogin = async () => {
    const loadingScreen = document.getElementById("loading-screen");

    loadingScreen.style.display = "block";
    const response = await doLogin(user.current.value, pass.current.value);
    loadingScreen.style.display = "none";

    const status =
      response !== undefined && response.data !== undefined
        ? response.data.status
        : "";

    if (status === "-1") {
      appendAlert(response.data.cause, "danger");
    } else if (status === "0") {
      appendAlert("Usuario o contraseña incorrecta", "danger");
    } else if (status === "1") {
      navigate("/dashboard");
    } else {
      appendAlert(
        "Error desconocido, por favor, inténtelo de nuevo más tarde",
        "danger"
      );
    }
    user.current.value = null;
    pass.current.value = null;
  };
  const appendAlert = (message, type) => {
    const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar alerta"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  const loginPanel = (
    <main
      className="anim_gradient"
    // style={{
    //   background: "linear-gradient(to top right,#EEE5E9,#383D3B)",
    // }}
    >
      <div className="container-fluid vh-100 ">
        <div className="row align-items-center justify-content-center vh-100">
          <div className="col-12 col-sm-6 col-lg-4  d-flex flex-column justify-content-center">
            <div className="card text-center p-md-4 p-0">
              <div className="card-body">
                <h1 className="text-secondary card-title mb-4 fs-2">
                  Iniciar sesión
                </h1>
                <div className="mb-3 text-start">
                  <label htmlFor="userInput" className="form-label">
                    Usuario
                  </label>
                  <input
                    type="text"
                    ref={user}
                    className="form-control"
                    value={Fuser}
                    id="userInput"
                    aria-required="true"
                    onChange={(e) => handleUserChange(e.target.value)}
                  />
                </div>
                <div className="mb-4 text-start">
                  <label htmlFor="passInput" className="form-label">
                    Contraseña
                  </label>

                  <div className="input-group">
                    <input
                      type={inputType}
                      ref={pass}
                      className="form-control"
                      id="passInput"
                      aria-required="true"
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
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <Icons.Eye /> : <Icons.EyeSlash />}
                      </button>
                    </OverlayTrigger>
                  </div>
                </div>

                <div id="liveAlertPlaceholder"></div>
                <div className="d-flex justify-content-center my-3">
                  <Link to={"/"}>
                    <button className="btn btn-outline-secondary mx-2">
                      Volver a inicio
                    </button>
                  </Link>
                  <button className="btn btn-primary mx-2" onClick={onLogin}>
                    Entrar
                  </button>
                </div>

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

  return getAuthStatus() === "0" ? loginPanel : <></>;
}

export default Login;
