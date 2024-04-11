import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Payment from "./pages/payment/Payment";
import Coins from "./pages/Coins";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trading from "./pages/Trading";
import Unknown from "./pages/Unknown";
import Welcome from "./pages/Welcome";

import "./assets/bootstrap.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/coins" element={<Coins />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/trading" element={<Trading />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="*" element={<Unknown />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  </React.StrictMode>
);