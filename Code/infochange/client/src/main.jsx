import React from "react";
import ReactDOM from "react-dom/client";

import "./assets/bootstrap.css";
import "bootstrap-icons/font/fonts/bootstrap-icons.woff";
import "bootstrap-icons/font/bootstrap-icons.min.css";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

import Authenticator from "./pages/authenticator/Authenticator";

// ordenar el login y register tambien
// todas las llamadas backend como auth() meterlas en un js o context o lo que sea pa ordenarlo
// ponerlo todo a int en los status

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Authenticator />
  </React.StrictMode>
);