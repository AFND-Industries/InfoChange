import { useRef, useState } from "react";
import Users from "../data/users.json";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Icons from "react-bootstrap-icons";
import "./login.css";
export default function Login(props) {
  const user = useRef("");
  const pass = useRef("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState("password");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setInputType(showPassword ? "password" : "text");
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
          <div className="col-12 col-md-4 d-flex flex-column justify-content-center">
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
                      placeholder="name@example.com"
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
                        placeholder="password"
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

                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="exampleCheck1"
                  />
                  <label class="form-check-label" for="exampleCheck1">
                    Mantener la sesión iniciada
                  </label>
                </div>
                <div className="d-flex justify-content-around mb-3">
                  <Link to={"/"}>
                    <button className="btn btn-outline-secondary">
                      Volver a inicio
                    </button>
                  </Link>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const findUser = Users.find(
                        (u) =>
                          u.profile.username === user.current.value &&
                          u.profile.password === pass.current.value
                      );
                      if (findUser !== undefined) {
                        sessionStorage.setItem(
                          "user",
                          JSON.stringify(findUser)
                        );
                        navigate("/dashboard");
                      } else {
                        setError("El usuario o la contraseña son incorrectos");
                      }
                    }}
                  >
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
