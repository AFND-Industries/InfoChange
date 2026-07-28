/**
 * Preguntas frecuentes. El acordeon sigue siendo el de Bootstrap mediante los
 * atributos data-bs-*, que funcionan porque main.jsx carga el paquete de
 * scripts; no se instancia ningun componente de Bootstrap desde JavaScript.
 */
const PREGUNTAS = [
  {
    id: "collapseOne",
    pregunta: "¿Qué es una criptomoneda y cómo funciona en InfoChange?",
    respuesta: (
      <>
        Una <strong>criptomoneda </strong>
        es una forma de moneda digital que utiliza la criptografía para
        garantizar transacciones seguras y para controlar la creación de nuevas
        unidades. En InfoChange, nos aseguramos de que comprendas este concepto
        fundamental mientras facilitamos su uso y comprensión en nuestra
        plataforma.
      </>
    ),
  },
  {
    id: "collapseTwo",
    pregunta: "¿Cómo funciona un exchange de criptomonedas y qué ofrece InfoChange?",
    respuesta: (
      <>
        Un <strong>exchange de criptomonedas </strong> es una plataforma en línea
        que permite a los usuarios comprar, vender e intercambiar criptomonedas.
        En InfoChange, te ofrecemos una plataforma segura y eficiente donde
        puedes realizar todas estas operaciones de forma rápida y sencilla.
      </>
    ),
  },
  {
    id: "collapseThree",
    pregunta: "¿Qué es un wallet de criptomonedas y por qué es importante en InfoChange?",
    respuesta: (
      <>
        Un <strong>wallet</strong> de criptomonedas es un programa o servicio que
        almacena las claves públicas y privadas que se utilizan para enviar y
        recibir criptomonedas. En InfoChange, entendemos la importancia de
        proteger tus activos digitales, por eso ofrecemos wallets seguros y
        confiables.
      </>
    ),
  },
  {
    id: "collapseFour",
    pregunta: "¿Cómo puedo empezar a operar con criptomonedas en InfoChange?",
    respuesta: (
      <>
        En InfoChange, te proporcionamos una guía paso a paso para comenzar a
        operar con criptomonedas. Desde la creación de una cuenta hasta la
        verificación de identidad y la realización de tu primera transacción, te
        acompañamos en todo el proceso para que puedas empezar con confianza.
      </>
    ),
  },
  {
    id: "collapseFive",
    pregunta:
      "¿Qué tipos de criptomonedas puedo encontrar en InfoChange y cómo puedo explorarlas?",
    respuesta: (
      <>
        InfoChange ofrece una amplia variedad de criptomonedas para explorar y
        operar. Desde Bitcoin y Ethereum hasta altcoins menos conocidas, nuestra
        plataforma te proporciona información detallada sobre cada una de ellas,
        incluyendo precios en tiempo real, gráficos y análisis.
      </>
    ),
  },
];

export default function FaqSection() {
  return (
    <section className="container d-flex justify-content-center align-items-center">
      <div className="col-md-10 text-center">
        <h1 className="row-md-4">Preguntas Frecuentes</h1>
        <div className="row-xs-12">
          <div className="accordion mb-5 " id="accordionExample">
            {PREGUNTAS.map(({ id, pregunta, respuesta }, indice) => {
              const abierta = indice === 0;

              return (
                <div className="accordion-item" key={id}>
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button${abierta ? "" : " collapsed"}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#${id}`}
                      aria-expanded={abierta}
                      aria-controls={id}
                    >
                      {pregunta}
                    </button>
                  </h2>
                  <div
                    id={id}
                    className={`accordion-collapse collapse${abierta ? " show" : ""}`}
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">{respuesta}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
