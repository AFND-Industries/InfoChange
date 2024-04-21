import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Payment from "./pages/payment/Payment";
import Coins from "./pages/coins/Coins";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trading from "./pages/trading/Trading";
import Unknown from "./pages/Unknown";
import Welcome from "./pages/Welcome";
import CoinInfo from "./pages/coins/CoinInfo";

import "./assets/bootstrap.css";
import "bootstrap-icons/font/fonts/bootstrap-icons.woff";
import "bootstrap-icons/font/bootstrap-icons.min.css";

/* Coins page dependencies */
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

const wrap = (v) => (
  <>
    <Header />
    {v}
    <Footer />
  </>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
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
  </React.StrictMode>
);
