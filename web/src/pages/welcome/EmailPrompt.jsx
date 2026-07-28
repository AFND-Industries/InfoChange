import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Tarjeta de acceso rapido de la portada. Solo recoge el correo y lo lleva a
 * /login, que lo lee del state de la navegacion para rellenar su formulario.
 */
export default function EmailPrompt() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  // Al estar dentro de un <form>, la tecla Intro tambien envia: antes el boton
  // era el unico camino y pulsar Intro no hacia nada.
  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/login", { state: { email } });
  };

  return (
    <div className="card text-center d-flex justify-content-center align-items-center">
      <img
        src="/usuario-anonimo.png"
        className="card-img-top mt-2"
        alt="Imagen de usuario"
        loading="lazy"
        style={{
          width: "30%",
          height: "30%",
          borderRadius: "100%",
        }}
      />
      <div className="card-body">
        <p className="card-text">
          Estas a un paso de empezar en el mundo de las criptomonedas!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="emailInput" className="form-label fw-bold">
              Inicia sesion
            </label>
            <input
              type="email"
              className="form-control mb-3"
              id="emailInput"
              aria-describedby="emailHelp"
              placeholder="Correo Electrónico"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <small id="emailHelp" className="sr-only">
              Introduce tu correo electrónico.
            </small>
          </div>
          <div>
            <button type="submit" className="btn btn-primary me-2">
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
