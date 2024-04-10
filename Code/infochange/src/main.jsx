import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import "./dist/bootstrap.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Header></Header>
    <Footer></Footer>
  </React.StrictMode>
);
