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

import Loading from "./pages/authenticator/Loading";
import UnknownStatus from "./pages/authenticator/UnknownStatus";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAuth } from "./pages/authenticator/AuthContext";

function App() {
  const { getAuthStatus } = useAuth();

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
      {v}
      <Footer />
    </>
  );
  const needAuth = (v) => <>{getAuthStatus() === "1" ? v : getPage()}</>;

  return (
    <>
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          id="liveToast"
          className="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <div
              className="rounded me-2"
              style={{
                backgroundColor: "red",
                width: "20px",
                height: "20px",
              }}
            ></div>
            <strong className="me-auto">Error</strong>
            <small>¡IMPORTANTE!</small>
            {false && (
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
              ></button>
            )}
          </div>
          <div className="toast-body">
            El servidor no está disponible en estos momentos.
          </div>
        </div>
      </div>

      <div className="d-flex flex-column min-vh-100">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={wrap(<Welcome />)} />
            <Route path="/coins/*" element={wrap(<Coins />)} />
            <Route
              path="/dashboard/:username"
              element={needAuth(wrap(<Dashboard />))}
            />
            <Route path="/dashboard" element={needAuth(wrap(<Dashboard />))} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/trading/:pair"
              element={needAuth(wrap(<Trading />))}
            />
            <Route path="/trading" element={needAuth(wrap(<Trading />))} />
            <Route
              path="/payment"
              element={needAuth(
                <Payment
                  cart={{
                    type: "VITE",
                    quantity: "0.0345",
                    price: "330",
                  }}
                />
              )}
            />
            <Route path="*" element={<Unknown />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
