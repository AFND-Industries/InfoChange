import { ChevronDoubleDown, RocketTakeoffFill } from "react-bootstrap-icons";
import { Parallax } from "react-parallax";

import TradingViewWidget from "../../components/TradingViewWidget";
import EmailPrompt from "./EmailPrompt";
import FaqSection from "./FaqSection";
import FeatureCards from "./FeatureCards";

import bgcripto from "../../assets/bg-cripto.jpg";
import "./Welcome.css";

/**
 * Portada. Es la unica pantalla que no va en un chunk aparte, asi que aqui solo
 * entran los iconos concretos que se usan (no el paquete entero) y contenido
 * estatico: no consulta la API ni necesita sesion.
 */
export default function Welcome() {
  return (
    <div className="container-fluid px-0 App">
      <section className="seccionInicial">
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ height: "70%" }}
        >
          <div className="row">
            <div className="col-lg-8 col-12 d-flex flex-column text-center  align-items-center justify-content-center">
              <h1>
                ¡Bienvenido a Infochange!
                <RocketTakeoffFill className="ms-2" />
              </h1>
              <h2>El exchange para todos</h2>
            </div>
            <div className="col-lg-4  col-12 d-flex flex-column  align-items-center justify-content-center ">
              <figure>
                <TradingViewWidget />
              </figure>
            </div>
          </div>
        </div>
        <div className="mt-6 text-primary text-center" style={{ height: "10%" }}>
          <p> Desliza para conocer mas </p>
          <ChevronDoubleDown />
        </div>
      </section>

      <section className="mb-5 ">
        <Parallax
          blur={{ min: -5, max: 20 }}
          bgImage={bgcripto}
          bgImageAlt="Fondo de criptomonedas"
          strength={-200}
          className="fade-effect"
        >
          <div className="container my-5 align-content-center custom-div ">
            <div className="row d-flex justify-content-center g-5">
              <div
                className="col-10 col-sm-10 col-md-8 col-lg-6 flex-column align-content-center text-center"
                style={{
                  backgroundColor: "rgba(200, 200, 200, 0.5)",
                  padding: "20px",
                  borderRadius: "20px",
                }}
              >
                <p className="fs-1 text-black">
                  Tu plataforma de trading de criptomonedas inteligente y
                  accesible. ¡Empieza a operar con confianza hoy mismo con tu
                  cuenta de InfoChange!
                </p>
              </div>
              <div className="col-10 col-sm-8 col-md-4 col-lg-3 flex-column align-content-center">
                <EmailPrompt />
              </div>
            </div>
          </div>
        </Parallax>
      </section>

      <FeatureCards />

      <hr />

      <FaqSection />
    </div>
  );
}
