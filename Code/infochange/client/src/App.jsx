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

import Loading from "./pages/authenticator/Loading";
import ServerNotAvailable from "./pages/authenticator/ServerNotAvailable";
import NotLogged from "./pages/authenticator/NotLogged";
import UnknownStatus from "./pages/authenticator/UnknownStatus";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAuth } from "./pages/authenticator/AuthContext";

function App() {
    const { getAuthStatus } = useAuth();

    const statusPages = {
        "-2": <Loading />,
        "-1": <ServerNotAvailable />,
        "0": <NotLogged />,
    };

    const getPage = (status) => statusPages[status] ?? <UnknownStatus status={status} />;

    const wrap = (v) => (
        <>
            <Header />
            {v}
            <Footer />
        </>
    );

    const needAuth = (v) => {
        const authStatus = getAuthStatus();
        const renderPage = authStatus === "1" ? v : getPage(authStatus);

        return (
            <>
                {renderPage}
            </>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={wrap(<Welcome />)} />
                    <Route path="/coins/*" element={wrap(<Coins />)} />
                    <Route path="/dashboard/:username" element={needAuth(wrap(<Dashboard />))} />
                    <Route path="/dashboard" element={needAuth(wrap(<Dashboard />))} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/trading/:pair" element={needAuth(wrap(<Trading />))} />
                    <Route path="/trading" element={needAuth(wrap(<Trading />))} />
                    <Route path="/payment" element={needAuth(<Payment />)} />
                    <Route path="*" element={<Unknown />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;