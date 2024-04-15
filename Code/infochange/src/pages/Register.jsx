import { Link } from "react-router-dom";
import Countries from "./../assets/countries.json";
import { useState } from "react";

export default function Register() {
  const [country, setCountry] = useState(Countries[0]);

  return (
    <div
      style={{
        background: "linear-gradient(to top right,#52dee5,#92dcf5)",
      }}
    >
      <div className="container d-flex flex-column justify-content-center align-items-center my-5">
        <div className="card text-center p-4">
          <div className="card-body text-start">
            <h2 className="text-secondary card-title mb-4 text-center">
              Regístrate
            </h2>
            <h5 className="text-center mb-4">Datos personales</h5>
            <div className="row">
              <div className="col-lg-4 mb-3">
                <label for="nameInput" class="form-label">
                  Nombre
                </label>
                <input id="nameInput" type="text" className="form-control" />
              </div>
              <div className="col-lg-8 mb-3">
                <label for="surnameInput" class="form-label">
                  Apellidos
                </label>
                <input
                  id="surnameInput"
                  type="text"
                  className="form-control"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 mb-5">
                <label for="userInput" class="form-label">
                  Usuario
                </label>
                <input id="userInput" type="text" className="form-control" />
              </div>
              <div className="col-lg-6 mb-5">
                <label for="emailInput" class="form-label">
                  Correo electrónico
                </label>
                <input
                  id="emailInput"
                  type="email"
                  className="form-control"
                  placeholder="example@infochange.org"
                />
              </div>
            </div>
            <h5 className="text-center mb-1">Datos fiscales</h5>
            <label for="directionInput" class="form-label">
              Dirección
            </label>
            <input
              id="directionInput"
              type="text"
              className="form-control mb-3"
              placeholder='Ex: Calle Diego "El Cigala", 34 '
            />
            <div className="row">
              <div className="col-lg-7 mb-3">
                <label for="countryInput" class="form-label">
                  País
                </label>
                <select
                  onChange={(e) =>
                    setCountry(Countries.find((v) => v.iso3 === e.target.value))
                  }
                  id="countryInput"
                  className="form-select"
                >
                  {Countries.map((v) => (
                    <option value={v.iso3}>{v.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="col-lg-5 mb-3">
                <label for="postalInput" class="form-label">
                  Código Postal
                </label>
                <input
                  id="postalInput"
                  type="number"
                  className="form-control"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 mb-3">
                <label for="userInput" class="form-label">
                  Teléfono móvil
                </label>
                <div className="input-group">
                  <span class="input-group-text">
                    {country === undefined ? "?" : "+" + country.phone_code}
                  </span>
                  <input id="phoneInput" type="text" className="form-control" />
                </div>
              </div>
              <div className="col-lg-6 mb-3">
                <label for="docInput" class="form-label">
                  Documento de identificación
                </label>
                <input
                  id="docInput"
                  type="text"
                  className="form-control"
                  placeholder="Ex: 12345678X"
                />
              </div>
            </div>
            <div className="row mb-5">
              <div className="col-lg-6 mb-4">
                <label for="passInput" class="form-label">
                  Contraseña
                </label>
                <input
                  id="passInput"
                  type="password"
                  className="form-control"
                />
              </div>
              <div className="col-lg-6 mb-4">
                <label for="rePassInput" class="form-label">
                  Repetir contraseña
                </label>
                <input
                  id="rePassInput"
                  type="password"
                  className="form-control"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 mb-3">
                <Link to={"/"}>
                  <button className="btn btn-outline-secondary w-100">
                    Volver a inicio
                  </button>
                </Link>
              </div>
              <div className="col-sm-6 mb-3">
                <Link to={"/"}>
                  <button className="btn btn-primary w-100">Registrarse</button>
                </Link>
              </div>
            </div>
            <p className="mb-0 fs-6 text-center">
              ¿Ya tienes una cuenta?
              <br />
              <Link to={"/login"} style={{ textDecoration: "none" }}>
                Inicia sesión pulsando sobre este enlace
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
