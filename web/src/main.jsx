import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Bootstrap se sirve ahora desde npm y no desde un CDN: la aplicacion dejaba de
// funcionar si jsdelivr no respondia, porque el codigo usaba `window.bootstrap`
// como si fuese un global garantizado.
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

import App from "./App";
import { ToastProvider } from "./providers/ToastProvider";
import { createQueryClient } from "./lib/query-client";
import "./styles/app.css";

const queryClient = createQueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
