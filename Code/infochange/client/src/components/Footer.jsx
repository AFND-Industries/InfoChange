import React from "react";

export default function App() {
  return (
    <footer className="text-center text-white bg-dark py-4">
      <div className="container-fluid">
        <section className="">
          <h5 className="mb-3">¡Suscríbete a nuestro boletín informativo!</h5>
          <form>
            <div className="row justify-content-center">
              <div className="col-auto">
                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Introduce tu email..."
                />
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-outline-light mb-3">
                  Suscribirse
                </button>
              </div>
            </div>
          </form>
        </section>
        <div className="w-100">© 2024 InfoChange.com</div>
      </div>
    </footer>
  );
}
