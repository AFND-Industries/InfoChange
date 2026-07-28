import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import Footer from "./components/Footer";
import Header from "./components/Header";
import {
  FullPageSpinner,
  RedirectIfAuthenticated,
  RequireAdmin,
  RequireAuth,
  RequireBackend,
} from "./components/RouteGuards";
import { TransferWatcher } from "./components/TransferWatcher";
import Welcome from "./pages/welcome/Welcome";

/**
 * Las pantallas grandes se cargan bajo demanda. Antes todo iba en un unico
 * bundle, asi que un visitante que solo abria la portada se descargaba tambien
 * el panel de administracion, el formulario de pago y las tablas de PrimeReact.
 */
const Coins = lazy(() => import("./pages/coins/Coins"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Login = lazy(() => import("./pages/Login_Register/Login"));
const Register = lazy(() => import("./pages/Login_Register/Register"));
const Trading = lazy(() => import("./pages/trading/Trading"));
const Payment = lazy(() => import("./pages/payment/Payment"));
const Admin = lazy(() => import("./pages/admin/Admin"));
const Unknown = lazy(() => import("./pages/Unknown"));

/** Cabecera y pie compartidos por las pantallas con navegacion. */
function Shell({ children }) {
  return (
    <>
      <Header />
      <main id="main_div" style={{ minHeight: "80vh" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <TransferWatcher />

      <Suspense fallback={<FullPageSpinner />}>
        <Routes>
          <Route
            path="/"
            element={
              <Shell>
                <Welcome />
              </Shell>
            }
          />

          <Route
            path="/coins/*"
            element={
              <RequireBackend>
                <Shell>
                  <Coins />
                </Shell>
              </RequireBackend>
            }
          />

          <Route
            path="/trading/:pair?"
            element={
              <RequireBackend>
                <Shell>
                  <Trading />
                </Shell>
              </RequireBackend>
            }
          />

          <Route
            path="/login"
            element={
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            }
          />

          <Route
            path="/register"
            element={
              <RedirectIfAuthenticated>
                <Register />
              </RedirectIfAuthenticated>
            }
          />

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Shell>
                  <Dashboard />
                </Shell>
              </RequireAuth>
            }
          />

          <Route
            path="/payment"
            element={
              <RequireAuth>
                <Payment />
              </RequireAuth>
            }
          />

          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <Shell>
                  <Admin />
                </Shell>
              </RequireAdmin>
            }
          />

          <Route path="*" element={<Unknown />} />
        </Routes>
      </Suspense>
    </div>
  );
}
