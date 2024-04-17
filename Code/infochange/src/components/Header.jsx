import { useState } from "react";
import banner from "../assets/banner.png";
import { Link } from "react-router-dom";

export default function Header() {
  const items = [
    { link: "", name: "Inicio" },
    { link: "coins", name: "Monedas" },
    { link: "trading", name: "Trading" },
    { link: "contact", name: "404 Example" },
  ];

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img src={banner} alt="InfoChange" width="200" height="50" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarScroll"
            aria-controls="navbarScroll"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarScroll">
            <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
              {items.map((v) => item(v.link, v.name))}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Link
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" aria-disabled="true">
                  Link
                </a>
              </li>
            </ul>
            <div className="d-flex justify-content-between">
              <Link to="/login">
                <button className="btn btn-outline-primary me-2">
                  Iniciar Sesión
                </button>
              </Link>
              <Link to="/register">
                <button className="btn btn-primary">Registrarse</button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

const item = (link, name) => {
  return (
    <li key={link} className="nav-item">
      <Link
        className={"nav-link" + (document.URL.endsWith(link) ? " active" : "")}
        to={"/" + link}
      >
        {name}
      </Link>
    </li>
  );
};
