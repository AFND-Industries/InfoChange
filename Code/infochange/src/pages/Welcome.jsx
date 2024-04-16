import React, { useState, useEffect, Component } from "react";
import "./welcome.css";
import * as Icons from "react-bootstrap-icons";
import TradingViewWidget from "./components/TradingViewWidget.jsx";
import { Parallax } from "react-parallax";

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
    <div className={`App ${loaded ? "loaded" : ""}`}>
      <div className="d-flex justify-content-center align-items-center mt-4 mb-5 py-2 mx-5">
        <div className="row">
          <div className="col col-md-8">
            <h2 className="text-cent">
              ¡Bienvenido a Infochage!
              <Icons.RocketTakeoffFill />
            </h2>
            <h2>
              Tu plataforma de trading de criptomonedas inteligente y accesible.
              ¡Empieza a operar con confianza hoy mismo! 📈💰
            </h2>
            <i className="bi bi-rocket-takeoff-fill"></i>
          </div>
          <div className="col col-md-4">
            <TradingViewWidget />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <div className="row row-md-12 g-4 mx-4">
          <div className="col">
            <div class="card">
              <img
                src="https://www.santander.com/content/dam/santander-com/es/stories/contenido-stories/2021/educacionfinanciera/im-storie-guia-para-saber-que-son-las-criptomonedas-3.jpg"
                class="card-img-top"
                alt="..."
                id="card_image"
              />
              <div class="card-body">
                <h5 class="card-title">Invierte hoy mismo</h5>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <a href="#" class="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
          </div>
          <div className="col">
            <div class="card">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3HtfCAMxulYVH25gpMMP6OZynyciD1yWvpO0oUKaedg&s"
                class="card-img-top"
                alt="..."
                id="card_image"
              />
              <div class="card-body">
                <h5 class="card-title">Perderas todo tu dinero</h5>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <a href="#" class="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
          </div>
          <div className="col">
            <div class="card">
              <img
                src="https://t4.ftcdn.net/jpg/00/58/54/07/360_F_58540776_2hIhJKUCrghGKszJhfeuul7hRpurV9RN.jpg"
                class="card-img-top"
                alt="..."
                id="card_image"
              />
              <div class="card-body">
                <h5 class="card-title">Para todos/as</h5>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <a href="#" class="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p />

      <Parallax
        blur={{ min: -15, max: 15 }}
        bgImage={"images/bg-cripto.jpg"}
        bgImageAlt="the dog"
        strength={-200}
      >
        <div style={{ height: "500px" }}></div>
      </Parallax>

      <div className="d-flex justify-content-center align-items-center">
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
                    Accordion Item #1
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  class="accordion-collapse collapse show"
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body">
                    <strong>This is the first item's accordion body.</strong> It
                    is shown by default, until the collapse plugin adds the
                    appropriate classes that we use to style each element. These
                    classes control the overall appearance, as well as the
                    showing and hiding via CSS transitions. You can modify any
                    of this with custom CSS or overriding our default variables.
                    It's also worth noting that just about any HTML can go
                    within the <code>.accordion-body</code>, though the
                    transition does limit overflow.
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
                    Accordion Item #2
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  class="accordion-collapse collapse"
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body">
                    <strong>This is the second item's accordion body.</strong>{" "}
                    It is hidden by default, until the collapse plugin adds the
                    appropriate classes that we use to style each element. These
                    classes control the overall appearance, as well as the
                    showing and hiding via CSS transitions. You can modify any
                    of this with custom CSS or overriding our default variables.
                    It's also worth noting that just about any HTML can go
                    within the <code>.accordion-body</code>, though the
                    transition does limit overflow.
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
                    Accordion Item #3
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  class="accordion-collapse collapse"
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body">
                    <strong>This is the third item's accordion body.</strong> It
                    is hidden by default, until the collapse plugin adds the
                    appropriate classes that we use to style each element. These
                    classes control the overall appearance, as well as the
                    showing and hiding via CSS transitions. You can modify any
                    of this with custom CSS or overriding our default variables.
                    It's also worth noting that just about any HTML can go
                    within the <code>.accordion-body</code>, though the
                    transition does limit overflow.
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
