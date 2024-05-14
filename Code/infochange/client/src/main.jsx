import React from "react";
import ReactDOM from "react-dom/client";

import "./assets/bootstrap.css";
import "bootstrap-icons/font/fonts/bootstrap-icons.woff";
import "bootstrap-icons/font/bootstrap-icons.min.css";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

import { AuthProvider } from "./pages/authenticator/AuthContext";
import { CoinsAPI } from "./pages/coins/CoinsAPI";
import { APIProvider } from "./context/APIContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <APIProvider>
      <CoinsAPI>
        <App />
      </CoinsAPI>
    </APIProvider>
  </AuthProvider>
);
