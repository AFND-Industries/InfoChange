import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Login(props) {
  const [user, setUser] = useState("");

  const error = useLocation().state?.error;

  return (
    <div
      style={{
        background: "linear-gradient(to top right,#52dee5,#92dcf5)",
      }}
    >
      <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
        <div className="card text-center p-4">
          <div className="card-body">
            <h2 className="text-secondary card-title mb-4">Iniciar sesión</h2>
            <div className="row mb-2 text-start">
              <div className="col-4">
                <label>Usuario</label>
              </div>
              <div className="col-8">
                <input
                  type="text"
                  onChange={(e) => setUser(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="row mb-4 text-start">
              <div className="col-4">
                <label>Contraseña</label>
              </div>
              <div className="col-8">
                <input type="password" className="form-control" />
              </div>
            </div>
            <div className="d-flex justify-content-around mb-3">
              <Link to={"/"}>
                <button className="btn btn-outline-secondary">
                  Volver a inicio
                </button>
              </Link>
              <Link to={`/dashboard/${user}`}>
                <button className="btn btn-primary">Entrar</button>
              </Link>
            </div>
            {error !== undefined ? (
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
  );
}
