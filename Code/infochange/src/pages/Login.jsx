import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="card border-secondary text-center p-4">
        <div className="card-body">
          <h2 className="text-secondary card-title mb-4">Iniciar sesión</h2>
          <div className="row mb-2 text-start">
            <div className="col-4">
              <label>Usuario</label>
            </div>
            <div className="col-8">
              <input type="text" className="form-control" />
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
          <div className="d-flex justify-content-around">
            <Link to={"/"}>
              <button className="btn btn-outline-secondary">Volver</button>
            </Link>
            <Link to={"/"}>
              <button className="btn btn-primary">Entrar</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
