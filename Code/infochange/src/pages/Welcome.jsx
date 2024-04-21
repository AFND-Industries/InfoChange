import React, { useState, useEffect, Component } from "react";
import "./welcome.css";
import * as Icons from "react-bootstrap-icons";
import TradingViewWidget from "../components/TradingViewWidget";
import { Parallax } from "react-parallax";
import { Link } from "react-router-dom";
export default function Welcome() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    // Simulando un retraso en la carga de la página
    const timeout = setTimeout(() => {
      setLoaded(true);
    }, 1000);

    // Limpiar el timeout al desmontar el componente
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`container-fluid px-0 App ${loaded ? "loaded" : ""}`}>
      <div style={{ height: "100vh", width: "100%" }}>
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ height: "70%" }}
        >
          <div className="row">
            <div className="col-lg-8 col-12 d-flex flex-column text-center  align-items-center justify-content-center">
              <h1>
                ¡Bienvenido a Infochage!
                <Icons.RocketTakeoffFill className="ml-2" />
              </h1>
              <h2>El exchange para todos</h2>
            </div>
            <div className="col-lg-4  col-12 d-flex flex-column  align-items-center justify-content-center ">
              <TradingViewWidget />
            </div>
          </div>
        </div>
        <div
          className="mt-6 text-primary text-center"
          style={{ height: "10%" }}
        >
          <p> Desliza para conocer mas </p>
          <Icons.ChevronDoubleDown className="" />
        </div>
      </div>
      <div className="mb-5">
        <Parallax
          blur={{ min: -5, max: 20 }}
          bgImage={"images/bg-cripto.jpg"}
          bgImageAlt="the dog"
          strength={-200}
        >
          <div className="my-5  align-content-center custom-div">
            <div>
              <div className="container">
                <div className="row d-flex justify-content-center g-5">
                  <div
                    className="col-lg-6 col-md-8 flex-column align-content-center text-center col-11"
                    style={{
                      backgroundColor: "rgba(200, 200, 200, 0.5)",
                      padding: "20px",
                      borderRadius: "20px",
                    }}
                  >
                    <p className="fs-1 text-black">
                      Tu plataforma de trading de criptomonedas inteligente y
                      accesible. ¡Empieza a operar con confianza hoy mismo con
                      tu cuenta de InfoChange!
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-4 flex-column  align-content-center col-7">
                    <div className="card text-center d-flex justify-content-center align-items-center">
                      <img
                        src="https://muellestock.com/images/usuario-anonimo.png"
                        className="card-img-top mt-2"
                        alt="Usuario Anónimo"
                        style={{
                          width: "30%",
                          height: "30%",
                          borderRadius: "100%",
                        }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">Inicia sesion</h5>

                        <p className="card-text">
                          Estas a un paso de empezar en el mundo de las
                          criptomonedas!
                        </p>
                        <div className="form-group">
                          <input
                            type="email"
                            className="form-control mb-3"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            placeholder="Correo Electrónico"
                          />
                        </div>
                        <div>
                          <Link to="/login">
                            <button className="btn btn-primary me-2">
                              Iniciar Sesión
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Parallax>
      </div>
      <div className="container-fluid">
        <div className="row flex-row g-3 my-5 mx-2 justify-content-evenly align-content-center justify-items-center">
          <div className="col-10 col-md ">
            <div className="card card-link" style={{ height: "100%" }}>
              <img
                src="https://www.santander.com/content/dam/santander-com/es/stories/contenido-stories/2021/educacionfinanciera/im-storie-guia-para-saber-que-son-las-criptomonedas-3.jpg"
                className="card-img-top"
                alt="texto alternativo"
                id="card_image"
              />
              <div className="card-body">
                <h5 className="card-title">
                  Explora el Mundo de las Criptomonedas
                </h5>
                <p className="card-text">
                  Embárcate en un viaje a través de las monedas digitales en
                  nuestro exchange. Encuentra precios actualizados y datos
                  esenciales para cada criptomoneda.
                </p>
                <Link to="/coins">
                  <button className="btn btn-primary me-2">Monedas</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-10 col-md">
            <div className="card card-link" style={{ height: "100%" }}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3HtfCAMxulYVH25gpMMP6OZynyciD1yWvpO0oUKaedg&s"
                className="card-img-top"
                alt="..."
                id="card_image"
              />
              <div className="card-body">
                <h5 className="card-title">
                  Explora el Mercado Cripto en Profundidad
                </h5>
                <p className="card-text">
                  Accede a nuestro exchange para explorar gráficos interactivos
                  y opciones de compra/venta de criptomonedas. ¡Empieza a operar
                  con confianza!
                </p>
                <Link to="/trading">
                  <button className="btn btn-primary me-2">Trading</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-10 col-md">
            <div className="card card-link" style={{ height: "100%" }}>
              <img
                src="https://t4.ftcdn.net/jpg/00/58/54/07/360_F_58540776_2hIhJKUCrghGKszJhfeuul7hRpurV9RN.jpg"
                className="card-img-top"
                alt="..."
                id="card_image"
              />
              <div className="card-body">
                <h5 className="card-title">Tu Wallet Cripto Personalizado</h5>
                <p className="card-text">
                  Descubre tu dashboard exclusivo, centrado en tu wallet de
                  criptomonedas. Gestiona y supervisa tus activos digitales con
                  facilidad y seguridad. ¡Tu tesoro digital, bajo tu control
                  absoluto!
                </p>
                <Link to="/dashboard">
                  <button className="btn btn-primary me-2">
                    Panel de Control
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p />
      <div className="container d-flex justify-content-center align-items-center">
        <div className="col-md-10 text-center">
          <h1 className="row-md-4">Preguntas Frecuentes</h1>
          <div className="row-xs-12">
            <div class="accordion" id="accordionExample">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    ¿Qué es una criptomoneda y cómo funciona en InfoChange?
                  </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show">
                  <div class="accordion-body">
                    Una <strong>criptomoneda </strong>
                    es una forma de moneda digital que utiliza la criptografía
                    para garantizar transacciones seguras y para controlar la
                    creación de nuevas unidades. En InfoChange, nos aseguramos
                    de que comprendas este concepto fundamental mientras
                    facilitamos su uso y comprensión en nuestra plataforma.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    ¿Cómo funciona un exchange de criptomonedas y qué ofrece
                    InfoChange?
                  </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse">
                  <div class="accordion-body">
                    Un <strong>exchange de criptomonedas </strong> es una
                    plataforma en línea que permite a los usuarios comprar,
                    vender e intercambiar criptomonedas. En InfoChange, te
                    ofrecemos una plataforma segura y eficiente donde puedes
                    realizar todas estas operaciones de forma rápida y sencilla.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    ¿Qué es un wallet de criptomonedas y por qué es importante
                    en InfoChange?
                  </button>
                </h2>
                <div id="collapseThree" class="accordion-collapse collapse">
                  <div class="accordion-body">
                    Un <strong>wallet</strong> de criptomonedas es un programa o
                    servicio que almacena las claves públicas y privadas que se
                    utilizan para enviar y recibir criptomonedas. En InfoChange,
                    entendemos la importancia de proteger tus activos digitales,
                    por eso ofrecemos wallets seguros y confiables.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFour"
                    aria-expanded="false"
                    aria-controls="collapseFour"
                  >
                    ¿Cómo puedo empezar a operar con criptomonedas en
                    InfoChange?
                  </button>
                </h2>
                <div id="collapseFour" class="accordion-collapse collapse">
                  <div class="accordion-body">
                    En InfoChange, te proporcionamos una guía paso a paso para
                    comenzar a operar con criptomonedas. Desde la creación de
                    una cuenta hasta la verificación de identidad y la
                    realización de tu primera transacción, te acompañamos en
                    todo el proceso para que puedas empezar con confianza.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFive"
                    aria-expanded="false"
                    aria-controls="collapseFive"
                  >
                    ¿Qué tipos de criptomonedas puedo encontrar en InfoChange y
                    cómo puedo explorarlas?
                  </button>
                </h2>
                <div id="collapseFive" class="accordion-collapse collapse">
                  <div class="accordion-body">
                    InfoChange ofrece una amplia variedad de criptomonedas para
                    explorar y operar. Desde Bitcoin y Ethereum hasta altcoins
                    menos conocidas, nuestra plataforma te proporciona
                    información detallada sobre cada una de ellas, incluyendo
                    precios en tiempo real, gráficos y análisis.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
