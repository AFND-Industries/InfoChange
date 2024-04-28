import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Payment from "./pages/payment/Payment";
import Coins from "./pages/coins/Coins";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trading from "./pages/trading/Trading";
import Unknown from "./pages/Unknown";
import Welcome from "./pages/welcome/Welcome";

import "./assets/bootstrap.css";
import "bootstrap-icons/font/fonts/bootstrap-icons.woff";
import "bootstrap-icons/font/bootstrap-icons.min.css";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

import axios from "axios";

// carpeta authenticator y mover componentes de sitio

function Loading() {
  console.log("Cargando...");

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 flex-column">
      <div className="alert alert-secondary">
        <span className="h1">Autenticando usuario...</span>
      </div>
      <span>(Aún no está implementado)</span>
    </div>
  );
}

function ServerNotAvailable() {
  console.log("Servidor no disponible...");

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-danger flex-column">
      <div className="alert alert-danger">
        <span className="h1">SERVIDOR NO DISPONIBLE</span>
      </div>
      <span className="alert alert-danger">(Si estás desarrollando, ve a main.jsx y pon un "1" en el setStatus de catch Exception para arreglarlo)</span>
    </div>
  );
}

function NotLogged() {
  console.log("¡No has iniciado sesión! Estado: " + status);

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 flex-column">
      <div className="alert alert-danger">
        <span className="h1">Usuario no autenticado</span><br />
      </div>
      <span>(Aquí habría que en vez de enseñar esto, redirigir a Welcome o a Login)</span>
    </div >
  );
}

function UnknownStatus({ status }) {
  console.log("Status desconocido: " + status);

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 flex-column">
      <div className="alert alert-danger">
        <span className="h1">Algo ha salido mal... Estado desconocido: {status}</span>
      </div>
      <span>(Contacta con el administrador y envíale una captura de esta pantalla)</span>
    </div>
  );
}

async function auth() {
  return await axios.get("http://localhost:1024/auth");
}

function App() {
  console.log("Usuario autenticado.");

  const wrap = (v) => (
    <>
      <Header />
      {v}
      <Footer />
    </>
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={wrap(<Welcome />)} />
          <Route path="/coins/*" element={wrap(<Coins />)} />
          <Route path="/dashboard/:username" element={wrap(<Dashboard />)} />
          <Route path="/dashboard" element={wrap(<Dashboard />)} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/trading/:pair" element={wrap(<Trading />)} />
          <Route path="/trading" element={wrap(<Trading />)} />
          <Route path="/payment" element={<Payment />} />
          <Route path="*" element={<Unknown />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

function Authenticator() {
  const [status, setStatus] = useState("-2"); // -2: Loading. -1: Server not available. 0 Not logged. 1 Logged

  const statusPages = {
    "-2": <Loading />,
    "-1": <ServerNotAvailable />,
    "0": <NotLogged />,
    "1": <App />
  }

  const getPage = (status) => statusPages[status] ?? <UnknownStatus status={status} />;

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const response = await auth();

        setStatus(response.data.status);
      } catch (Exception) {
        console.log("El servidor no está disponible en estos momentos.");

        setStatus("1"); // Pon aqui un 1 si quieres que aunque no vaya el servidor te deje entrar al front-end
        // normalmente tiene que ser un -1, server not available 
        //(se puede hacer que diferencie entre si tienes internet o no)
      }
    }

    fetchAuth();
  }, []);

  return getPage(status);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <Authenticator />
);