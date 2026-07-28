import { Link } from "react-router-dom";

/** Las tres tarjetas de secciones. Contenido fijo, sin datos de la API. */
const TARJETAS = [
  {
    destino: "/coins",
    imagen: "/crypto-coins.jpeg",
    alt: "Varias criptomonedas, incluyendo Bitcoin, Ethereum, y Litecoin",
    titulo: "Explora el Mundo de las Criptomonedas",
    texto:
      "Embárcate en un viaje a través de las monedas digitales en nuestro exchange. Encuentra precios actualizados y datos esenciales para cada criptomoneda.",
    boton: "Monedas",
    ayuda: "Pulsa para ir a ver las monedas",
  },
  {
    destino: "/trading",
    imagen: "/crypto-trading.jpg",
    alt: "Gráfico de trading de criptomonedas",
    titulo: "Explora el Mercado Cripto en Profundidad",
    texto:
      "Accede a nuestro exchange para explorar gráficos interactivos y opciones de compra/venta de criptomonedas. ¡Empieza a operar con confianza!",
    boton: "Trading",
    ayuda: "Pulsa para ir a ver las graficas",
  },
  {
    destino: "/dashboard",
    imagen: "/wallet.jpg",
    alt: "Wallet de criptomonedas personalizado",
    titulo: "Tu Wallet Cripto Personalizado",
    texto:
      "Descubre tu dashboard exclusivo, centrado en tu wallet de criptomonedas. Gestiona y supervisa tus activos digitales con facilidad y seguridad. ¡Tu tesoro digital, bajo tu control absoluto!",
    boton: "Panel de Control",
    ayuda: "Pulsa para ir a ver tu cartera",
  },
];

export default function FeatureCards() {
  return (
    <section className="container-fluid">
      <div className="row flex-row g-3 my-5 mx-2 justify-content-evenly align-content-center justify-items-center">
        {TARJETAS.map((tarjeta) => (
          <article className="col-12 col-md-4" key={tarjeta.destino}>
            <div className="card card-link" style={{ height: "100%" }}>
              <img
                src={tarjeta.imagen}
                className="card-img-top card-image"
                alt={tarjeta.alt}
                loading="lazy"
              />
              <div className="card-body">
                <h2 className="card-title fs-5">{tarjeta.titulo}</h2>
                <p className="card-text">{tarjeta.texto}</p>
                <Link to={tarjeta.destino}>
                  <button className="btn btn-primary me-2" aria-label={tarjeta.ayuda}>
                    {tarjeta.boton}
                  </button>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
