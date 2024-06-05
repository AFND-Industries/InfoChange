import React, { useEffect } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Payment from "./pages/payment/Payment";
import Coins from "./pages/coins/Coins";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trading from "./pages/trading/Trading";
import Unknown from "./pages/Unknown";
import Welcome from "./pages/welcome/Welcome";
import Admin from "./pages/admin/Admin";

import Loading from "./pages/authenticator/Loading";
import UnknownStatus from "./pages/authenticator/UnknownStatus";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ServerErrorToast from "./components/ServerErrorToast";
import LoadingScreen from "./components/LoadingScreen";

import { useAuth } from "./pages/authenticator/AuthContext";

function App() {
  const { getAuthStatus, getActualUser } = useAuth();

  useEffect(() => {
    const toast = new bootstrap.Toast(document.getElementById("liveToast"), {
      autohide: false,
    });

    if (getAuthStatus() == "-1") toast.show();
    else toast.hide();
  }, [getAuthStatus()]);

  const statusPages = {
    "-2": <Loading />,
    "-1": <Navigate to="/" />,
    0: <Navigate to="/login" />,
  };

  const getPage = () =>
    statusPages[getAuthStatus()] ?? <UnknownStatus status={getAuthStatus()} />;

  const wrap = (v) => (
    <>
      <Header />
      <div id="main_div" style={{ minHeight: "80vh" }}>
        {v}
      </div>
      <Footer />
    </>
  );

  const needBackend = (v) => (
    <>{getAuthStatus() === "-1" ? <Navigate to="/" /> : v}</>
  );
  const needAuth = (v) => (
    <>{needBackend(getAuthStatus() === "1" ? v : getPage())}</>
  );
  const needAdmin = (v) => (
    <>
      {getActualUser() !== null && getActualUser().profile.firstName === "admin" ? (
        v
      ) : (
        <Unknown />
      )}
    </>
  );

  return (
    <>
      <LoadingScreen />

      <div className="d-flex flex-column min-vh-100">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={wrap(<Welcome />)} />
            <Route path="/coins/*" element={needBackend(wrap(<Coins />))} />
            <Route
              path="/dashboard/:username"
              element={needAuth(wrap(<Dashboard />))}
            />
            <Route path="/dashboard" element={needAuth(wrap(<Dashboard />))} />
            <Route path="/login" element={needBackend(<Login />)} />
            <Route path="/register" element={needBackend(<Register />)} />
            <Route
              path="/trading/:pair"
              element={needBackend(wrap(<Trading />))}
            />
            <Route path="/trading" element={needBackend(wrap(<Trading />))} />
            <Route
              path="/payment"
              element={needAuth(
                <Payment
                  cart={{
                    type: "BTC",
                    quantity: "0.0345",
                    price: "0",
                  }}
                />
              )}
            />
            <Route path="/admin" element={needAdmin(wrap(<Admin />))} />
            <Route path="*" element={<Unknown />} />
          </Routes>
        </BrowserRouter>
      </div>

      <ServerErrorToast />
    </>
  );
}

export default App;
