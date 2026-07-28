/**
 * Pie comun.
 *
 * Se ha quitado el formulario de suscripcion al boletin: no existe ningun
 * servicio detras, asi que enviarlo solo recargaba la pagina y perdia lo
 * escrito. Tambien desaparece el dominio infoChange.com, que ya no esta
 * registrado. Queda el aviso de que esto es un simulador.
 */
export default function Footer() {
  return (
    <footer className="text-center text-white bg-dark py-4">
      <div className="container-fluid">
        <section className="mb-3">
          <h2 className="mb-2 fs-5">InfoChange es un simulador</h2>
          <p className="mb-0 mx-auto" style={{ maxWidth: "48rem" }}>
            Los precios vienen del mercado real, pero los saldos, las operaciones
            y los medios de pago son ficticios: no se mueve dinero ni se guardan
            datos bancarios.
          </p>
        </section>

        <div className="w-100" aria-label="Derechos de autor">
          © 2024 InfoChange -
          <a href="https://github.com/AFND-Industries"> AFND Industries</a> -
          <a href="/api/health" target="_blank" rel="noreferrer">
            {" "}
            Estado del servicio
          </a>
        </div>
      </div>
    </footer>
  );
}
