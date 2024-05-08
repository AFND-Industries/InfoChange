import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import * as Icons from "react-bootstrap-icons";

import { useAuth } from "./authenticator/AuthContext";

import "./login.css";

function Login() {
  const location = useLocation();
  const { doLogin } = useAuth();
  const navigate = useNavigate();

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
    let email = location.state !== nullgit ? location.state.email : "";
    setUser(email);
  }, []);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setInputType(showPassword ? "password" : "text");
  };

  const onLogin = async () => {
    const response = await doLogin(user.current.value, pass.current.value);
    const status =
      response !== undefined && response.data !== undefined
        ? response.data.status
        : "";

    if (status === "-1") {
      setError(response.data.cause);
    } else if (status === "0") {
      setError("Usuario o contraseña incorrecta");
    } else if (status === "1") {
      navigate("/dashboard");
    } else {
      console.log(response);
      setError("Error desconocido (por ahora)");
    }

    user.current.value = null;
    pass.current.value = null;
  };

  return (
    <div
      className="anim_gradient"
      // style={{
      //   background: "linear-gradient(to top right,#EEE5E9,#383D3B)",
      // }}
    >
      <div className="container-fluid vh-100 ">
        <div className="row align-items-center justify-content-center vh-100">
          <div className="col-12 col-md-6 col-xl-4 d-flex flex-column justify-content-center">
            <div className="card text-center p-4">
              <div className="card-body">
                <h2 className="text-secondary card-title mb-4">
                  Iniciar sesión
                </h2>
                <div className="row mb-2 text-start">
                  <div className="col-4">
                    <label>Usuario</label>
                  </div>
                  <div className="col-8">
                    <input
                      type="text"
                      ref={user}
                      className="form-control"
                      placeholder="Tu usuario..."
                      value={Fuser}
                      onChange={(e) => handleUserChange(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row mb-4 text-start">
                  <div className="col-4">
                    <label>Contraseña</label>
                  </div>
                  <div className="col-8">
                    <div className="input-group">
                      <input
                        type={inputType}
                        ref={pass}
                        className="form-control"
                        placeholder="Tu contraseña..."
                      />
                      <button
                        type="button"
                        className="btn btn-dark"
                        onMouseDown={togglePasswordVisibility}
                        onMouseUp={togglePasswordVisibility}
                        onMouseLeave={() => setInputType("password")}
                      >
                        {showPassword ? <Icons.Eye /> : <Icons.EyeSlash />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                  />
                  <label className="form-check-label" for="exampleCheck1">
                    Mantener la sesión iniciada
                  </label>
                </div>
                <div className="d-flex justify-content-around mb-3">
                  <Link to={"/"}>
                    <button className="btn btn-outline-secondary">
                      Volver a inicio
                    </button>
                  </Link>
                  <button className="btn btn-primary" onClick={onLogin}>
                    Entrar
                  </button>
                </div>
                {error.length !== 0 ? (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="alert"
                      aria-label="Close"
                    ></button>
                    {error}
                  </div>
                ) : undefined}
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
    </div>
  );
}

export default Login;
