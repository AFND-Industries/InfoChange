import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { XLg } from "react-bootstrap-icons";

import Banner from "../../assets/payment_banner.png";
import BusyOverlay from "../../components/BusyOverlay";
import { useSession } from "../../hooks/useSession";
import { useDeposit, useWithdraw } from "../../hooks/useWallet";
import { useToast } from "../../providers/ToastProvider";

import "./Payment.css";
import StepList from "./StepList";
import ConfirmPayment from "./steps/ConfirmPayment";
import { CardForm, IbanForm, PaypalForm } from "./steps/DataForm";
import PaymentCompleted from "./steps/PaymentCompleted";
import SelectPayMethod from "./steps/SelectPayMethod";

const TOTAL_STEPS = 4;
const SETTLEMENT_ASSET = "USDT";

/**
 * Normaliza lo que llega en el estado de navegacion. El importe se mantiene como
 * cadena para no perder precision y solo se acepta si es un numero positivo:
 * antes bastaba con llegar aqui con una cantidad negativa para que una retirada
 * sumase saldo en lugar de restarlo.
 */
function readCart(state) {
  if (!state) return null;

  const action = state.action === "in" || state.action === "out" ? state.action : null;
  if (!action) return null;

  const amount = String(state.amount ?? state.quantity ?? "")
    .trim()
    .replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(amount) || Number(amount) <= 0) return null;

  return { action, amount };
}

export default function Payment() {
  const cart = readCart(useLocation().state);

  const [step, setStep] = useState(1);
  const [method, setMethod] = useState(null);

  const toast = useToast();
  const { balances } = useSession();
  const deposit = useDeposit();
  const withdraw = useWithdraw();

  // Ambas mutaciones se declaran siempre; solo se usa la que toca.
  const mutation = cart?.action === "out" ? withdraw : deposit;

  if (cart === null) {
    return (
      <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
        <div className="card p-2">
          <div className="card-body text-center">
            <h3>Ups... ha ocurrido un error con tu compra</h3>
            <h4 className="text-body-secondary">
              La cantidad indicada no es válida. Vuelva a intentarlo desde su
              cartera.
            </h4>
            <Link to={"/dashboard"}>
              <button className="btn btn-outline-danger">
                Volver al panel de control
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isDeposit = cart.action === "in";
  // No tener fila de USDT es tener cero: si se dejase sin definir, el aviso de
  // saldo insuficiente se apagaria justo en el caso en que siempre acierta.
  const available =
    balances.find((balance) => balance.asset === SETTLEMENT_ASSET)?.quantity ??
    "0";

  const selectMethod = (type) => {
    // Si se vuelve al mismo medio se conservan los datos ya escritos; si se
    // cambia de medio se descartan los del anterior.
    setMethod((current) => (current?.type === type ? current : { type }));
    setStep(2);
  };

  // El medio se conserva al volver al paso 1: es `selectMethod` quien decide si
  // los datos siguen valiendo (mismo medio) o se descartan (medio distinto).
  const backToMethods = () => setStep(1);

  const backToForm = () => {
    mutation.reset();
    setStep(2);
  };

  const confirm = async () => {
    try {
      await mutation.mutateAsync({ amount: cart.amount, method });
      setStep(TOTAL_STEPS);
    } catch (error) {
      toast.error(
        isDeposit
          ? "No se ha podido completar el pago"
          : "No se ha podido completar la retirada",
        error.message,
      );
    }
  };

  return (
    <div className="anim-gradient">
      <BusyOverlay
        show={mutation.isPending}
        label={isDeposit ? "Procesando el pago..." : "Procesando la retirada..."}
      />

      <div className="container d-flex flex-column justify-content-center min-vh-100">
        <div className="card p-2 mb-3 mt-5">
          <div className="card-body">
            <div className="container d-flex align-items-center">
              <img
                className="mb-3 me-3"
                alt="InfoPay banner"
                src={Banner}
                width={"25%"}
              />
              <h1 className="fs-3">
                Plataforma de pago InfoPay
                <span className="fs-6">&reg;</span>
              </h1>

              <Link
                to={"/dashboard"}
                className={"ms-auto" + (step === TOTAL_STEPS ? " d-none" : "")}
              >
                <button className="btn btn-outline-danger text-center">
                  <XLg className="me-2" />
                  <span className="d-sm-inline d-none">
                    Cancelar {isDeposit ? "pago" : "ingreso"}
                  </span>
                </button>
              </Link>
            </div>
            <div className="row mb-3 g-4">
              <StepList action={cart.action} current={step} />
              <main className="col-md-8">
                <h2 className="fs-4">Paso {step}</h2>
                <div className="mb-3">
                  {step === 1 ? (
                    <SelectPayMethod action={cart.action} onSelect={selectMethod} />
                  ) : step === 2 ? (
                    <DataStep
                      method={method}
                      onSubmit={(filled) => {
                        setMethod(filled);
                        setStep(3);
                      }}
                      onBack={backToMethods}
                    />
                  ) : step === 3 ? (
                    <ConfirmPayment
                      cart={cart}
                      method={method}
                      available={available}
                      error={mutation.isError ? mutation.error.message : null}
                      pending={mutation.isPending}
                      onConfirm={confirm}
                      onBack={backToForm}
                    />
                  ) : (
                    <PaymentCompleted cart={cart} />
                  )}
                </div>
              </main>
            </div>
            <section className="progress">
              <div
                role="progressbar"
                aria-label="Barra de progreso"
                aria-valuemin={1}
                aria-valuemax={TOTAL_STEPS}
                aria-valuenow={step}
                className="progress-bar"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              ></div>
            </section>
          </div>
        </div>
        <p className="text-center text-light">AFND Industries 2024 &copy;</p>
      </div>
    </div>
  );
}

function DataStep({ method, onSubmit, onBack }) {
  const props = { method, onSubmit, onBack };

  if (method?.type === "CARD") return <CardForm {...props} />;
  if (method?.type === "IBAN") return <IbanForm {...props} />;
  if (method?.type === "PAYPAL") return <PaypalForm {...props} />;
  return null;
}
