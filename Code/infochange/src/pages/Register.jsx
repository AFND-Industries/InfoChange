import { Link, redirect, useNavigate } from "react-router-dom";
import Countries from "./../assets/countries.json";
import { useRef, useState } from "react";

import Users from "./../data/users.json";

export default function Register() {
  const [country, setCountry] = useState(Countries[0]);

  const navigate = useNavigate();

  const name = useRef(null);
  const surname = useRef(null);
  const user = useRef(null);
  const email = useRef(null);
  const phone = useRef(null);
  const _document = useRef(null);
  const address = useRef(null);
  const postalCode = useRef(null);
  const password = useRef(null);

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
                <label htmlFor="nameInput" className="form-label">
                  Nombre
                </label>
                <input
                  id="nameInput"
                  ref={name}
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="col-lg-8 mb-3">
                <label htmlFor="surnameInput" className="form-label">
                  Apellidos
                </label>
                <input
                  id="surnameInput"
                  ref={surname}
                  type="text"
                  className="form-control"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 mb-5">
                <label htmlFor="userInput" className="form-label">
                  Usuario
                </label>
                <input
                  id="userInput"
                  ref={user}
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="col-lg-6 mb-5">
                <label htmlFor="emailInput" className="form-label">
                  Correo electrónico
                </label>
                <input
                  id="emailInput"
                  ref={email}
                  type="email"
                  className="form-control"
                  placeholder="example@infochange.org"
                />
              </div>
            </div>
            <h5 className="text-center mb-1">Datos fiscales</h5>
            <label htmlFor="directionInput" className="form-label">
              Dirección
            </label>
            <input
              id="directionInput"
              type="text"
              ref={address}
              className="form-control mb-3"
              placeholder='Ex: Calle Diego "El Cigala", 34 '
            />
            <div className="row">
              <div className="col-lg-7 mb-3">
                <label htmlFor="countryInput" className="form-label">
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
                    <option key={v.iso3} value={v.iso3}>
                      {v.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-5 mb-3">
                <label htmlFor="postalInput" className="form-label">
                  Código Postal
                </label>
                <input
                  id="postalInput"
                  type="number"
                  ref={postalCode}
                  className="form-control"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 mb-3">
                <label htmlFor="userInput" className="form-label">
                  Teléfono móvil
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    {country === undefined ? "?" : "+" + country.phone_code}
                  </span>
                  <input
                    id="phoneInput"
                    ref={phone}
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-lg-6 mb-3">
                <label htmlFor="docInput" className="form-label">
                  Documento de identificación
                </label>
                <input
                  id="docInput"
                  type="text"
                  ref={_document}
                  className="form-control"
                  placeholder="Ex: 12345678X"
                />
              </div>
            </div>
            <div className="row mb-5">
              <div className="col-lg-6 mb-4">
                <label htmlFor="passInput" className="form-label">
                  Contraseña
                </label>
                <input
                  id="passInput"
                  ref={password}
                  type="password"
                  className="form-control"
                />
              </div>
              <div className="col-lg-6 mb-4">
                <label htmlFor="rePassInput" className="form-label">
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
                <button
                  className="btn btn-primary w-100"
                  onClick={() => {
                    addUser({
                      profile: {
                        username: user.current.value,
                        name: name.current.value,
                        surname: surname.current.value,
                        email: email.current.value,
                        phone: `+${country.phone_code} ${phone.current.value}`,
                        document: _document.current.value,
                        address: address.current.value,
                        postalCode: postalCode.current.value,
                        country: country.nombre,
                      },
                      wallet: {},
                    });
                    navigate("/dashboard");
                  }}
                >
                  Registrarse
                </button>
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

function addUser(user) {
  console.log(user);
}
