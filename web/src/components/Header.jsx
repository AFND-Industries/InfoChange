import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Person } from "react-bootstrap-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";

import banner from "../assets/banner.png";
import BusyOverlay from "./BusyOverlay";
import { useLogout, useSession } from "../hooks/useSession";
import { useToast } from "../providers/ToastProvider";

import "./header.css";

const BASE_ITEMS = [
  { link: "", name: "Inicio" },
  { link: "coins", name: "Monedas" },
  { link: "trading", name: "Trading" },
];

/**
 * Cabecera comun.
 *
 * El desplegable y el menu plegable se montan con react-bootstrap en lugar de
 * con los atributos `data-bs-toggle`: asi no dependen de que el JavaScript
 * global de Bootstrap se haya cargado ni de que haya inicializado los elementos
 * que React pinta despues.
 */
export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, status } = useSession();
  const logout = useLogout();
  const toast = useToast();

  // El panel de administracion se ofrece segun el rol que envia el servidor.
  // Antes bastaba con llamarse "admin" de nombre para ver el enlace.
  const items = isAdmin
    ? [...BASE_ITEMS, { link: "admin", name: "Admin" }]
    : BASE_ITEMS;

  // La version anterior leia `document.URL`, que no se entera de las
  // navegaciones del router hasta que el navegador actualiza la barra.
  const section = location.pathname.split("/")[1].toLowerCase();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      navigate("/");
    } catch (error) {
      toast.error("No se ha podido cerrar la sesion", error.message);
    }
  };

  return (
    <header>
      <BusyOverlay show={logout.isPending} label="Cerrando sesion..." />

      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <img src={banner} alt="InfoChange logo" width="200" height="50" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarScroll" />

          <Navbar.Collapse id="navbarScroll">
            <Nav as="ul" className="me-auto my-2 my-lg-0 navbar-nav-scroll">
              {items.map(({ link, name }) => {
                const active = section === link.toLowerCase();

                return (
                  <Nav.Item as="li" key={link}>
                    <Nav.Link
                      as={Link}
                      to={`/${link}`}
                      className={"text-dark" + (active ? " active fw-bold" : "")}
                      aria-current={active ? "page" : undefined}
                      style={{ color: "#0d6efd" }} // Color primario de Bootstrap
                    >
                      {name}
                    </Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>

            {/*
              Mientras se resuelve la sesion no se pinta ninguna de las dos
              opciones: mirar solo `user === null` mostraba un parpadeo de
              "Iniciar Sesion / Registrarse" en cada carga a quien ya tenia la
              sesion abierta.
            */}
            {status === "loading" ? null : user === null ? (
              <div className="d-flex justify-content-between">
                <Link to="/login" className="btn btn-outline-primary me-2">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Registrarse
                </Link>
              </div>
            ) : (
              <div className="d-flex justify-content-between">
                <Dropdown className="me-2">
                  <Dropdown.Toggle
                    id="header-user-menu"
                    variant="outline-primary"
                    className="d-flex align-items-center"
                  >
                    <Person className="me-2 fs-4" /> {user.username}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/dashboard">
                      Panel de control
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleLogout}
                  disabled={logout.isPending}
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
