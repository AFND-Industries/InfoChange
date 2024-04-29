import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Payment from "./pages/payment/Payment";
import Coins from "./pages/coins/Coins";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trading from "./pages/trading/Trading";
import Unknown from "./pages/Unknown";
import Welcome from "./pages/welcome/Welcome";

import Header from "./components/Header";
import Footer from "./components/Footer";

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
    );
}

export default App;