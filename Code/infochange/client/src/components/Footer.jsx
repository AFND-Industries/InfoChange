import React from "react";

export default function App() {
  return (
    <footer className="text-center text-white bg-dark py-4">
      <div className="container-fluid">
        <section>
          <h1 className="mb-3 fs-3">
            ¡Suscríbete a nuestro boletín informativo!
          </h1>
          <form>
            <div className="row justify-content-center">
              <label
                htmlFor="newsletter-email"
                className="col-auto col-form-label"
              >
                Email:
              </label>
              <div className="col-auto">
                <input
                  id="newsletter-email"
                  type="email"
                  className="form-control mb-3"
                  placeholder="Introduce tu email..."
                  aria-label="Introduce tu email para suscribirte al boletín informativo"
                  aria-required="true"
                />
              </div>
              <div className="col-auto">
                <button
                  type="submit"
                  className="btn btn-outline-light mb-3"
                  aria-label="Suscribirse al boletín informativo"
                >
                  Suscribirse
                </button>
              </div>
            </div>
          </form>
        </section>
        <div className="w-100" aria-label="Derechos de autor">
          © 2024 InfoChange.com
        </div>
      </div>
    </footer>
  );
}
