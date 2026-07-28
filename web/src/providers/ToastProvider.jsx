import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const ToastContext = createContext(null);

const VARIANT_ICON = {
  success: "bi-check-circle-fill",
  danger: "bi-exclamation-triangle-fill",
  warning: "bi-exclamation-circle-fill",
  info: "bi-info-circle-fill",
};

/**
 * Avisos de la aplicacion.
 *
 * La version anterior instanciaba `new bootstrap.Toast(...)` sobre elementos
 * buscados con `getElementById` y escribia el contenido con `innerHTML`,
 * concatenando datos que venian del servidor: un nombre de usuario con etiquetas
 * HTML se ejecutaba en el navegador de quien recibia el aviso. Aqui el contenido
 * pasa por React, que lo escapa siempre.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    ({ title, body, variant = "info", autohide = true, delay = 5000 }) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, title, body, variant, autohide, delay }]);
      return id;
    },
    [],
  );

  const value = useMemo(
    () => ({
      notify,
      dismiss,
      success: (title, body) => notify({ title, body, variant: "success" }),
      error: (title, body) => notify({ title, body, variant: "danger" }),
      info: (title, body) => notify({ title, body, variant: "info" }),
    }),
    [notify, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <ToastContainer
        className="p-3 position-fixed"
        position="bottom-end"
        style={{ zIndex: 1090 }}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            bg={toast.variant === "info" ? undefined : toast.variant}
            onClose={() => dismiss(toast.id)}
            show
            autohide={toast.autohide}
            delay={toast.delay}
          >
            <Toast.Header>
              <i
                className={`bi ${VARIANT_ICON[toast.variant]} me-2`}
                aria-hidden="true"
              />
              <strong className="me-auto">{toast.title}</strong>
            </Toast.Header>
            {toast.body ? (
              <Toast.Body className={toast.variant === "info" ? "" : "text-white"}>
                {toast.body}
              </Toast.Body>
            ) : null}
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de <ToastProvider>.");
  }
  return context;
}
