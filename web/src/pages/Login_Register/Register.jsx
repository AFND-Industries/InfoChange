import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

import BusyOverlay from "../../components/BusyOverlay";
import { useRegister } from "../../hooks/useSession";
import { useToast } from "../../providers/ToastProvider";
import AccountDataStep from "./steps/AccountDataStep";
import BillingDataStep from "./steps/BillingDataStep";
import PersonalDataStep from "./steps/PersonalDataStep";
import RegisterStepper from "./steps/RegisterStepper";
import { dialCodeFor } from "./steps/countries";

import "./login.css";

const STEPS = [
  "Informacion Personal",
  "Informacion sobre la cuenta",
  "Datos de facturación",
];

const EMPTY_PERSONAL = {
  firstName: "",
  lastName: "",
  birthDate: "",
  gender: "",
};

const EMPTY_ACCOUNT = {
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  securityQuestionId: "",
  securityAnswer: "",
};

const EMPTY_BILLING = {
  address: "",
  country: "",
  city: "",
  zipCode: "",
  phone: "",
  documentId: "",
  terms: false,
};

/**
 * Une los tres pasos en el cuerpo que espera POST /auth/register. `terms` y
 * `confirmPassword` solo existen en el formulario y no se envian.
 */
function buildRegisterInput(personal, account, billing) {
  return {
    firstName: personal.firstName.trim(),
    lastName: personal.lastName.trim(),
    birthDate: personal.birthDate,
    gender: personal.gender,
    username: account.username.trim(),
    email: account.email.trim(),
    password: account.password,
    securityQuestionId: Number(account.securityQuestionId),
    securityAnswer: account.securityAnswer.trim(),
    address: billing.address.trim(),
    city: billing.city.trim(),
    zipCode: billing.zipCode.trim(),
    country: billing.country,
    // El prefijo se ensena junto al campo, asi que forma parte del numero.
    phone: `${dialCodeFor(billing.country)}${billing.phone.trim()}`,
    documentId: billing.documentId.trim(),
  };
}

/**
 * Registro en tres pasos.
 *
 * Solo se ocupa de encadenar los pasos y de enviar; cada formulario y su
 * validacion viven en `steps/`. La version anterior guardaba los valores de
 * cada paso en su propio estado y lanzaba el alta desde un `useEffect` que se
 * disparaba cuando los tres dejaban de ser nulos, de modo que volver atras y
 * reenviar registraba al usuario otra vez.
 */
export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const register = useRegister();

  const [activeStep, setActiveStep] = useState(0);
  const [personal, setPersonal] = useState(EMPTY_PERSONAL);
  const [account, setAccount] = useState(EMPTY_ACCOUNT);
  const [billing, setBilling] = useState(EMPTY_BILLING);

  const handleBack = () => setActiveStep((step) => Math.max(0, step - 1));

  const handlePersonalSubmit = (values) => {
    setPersonal(values);
    setActiveStep(1);
  };

  const handleAccountSubmit = (values) => {
    setAccount(values);
    setActiveStep(2);
  };

  const handleBillingSubmit = async (values) => {
    setBilling(values);
    register.reset();

    try {
      await register.mutateAsync(buildRegisterInput(personal, account, values));
      toast.success(
        "¡Gracias por registrarte!",
        "Tu registro ha sido exitoso. ¡Bienvenido a nuestra comunidad!",
      );
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error("No se ha podido completar el registro", error.message);
    }
  };

  return (
    <>
      <div className="anim_gradient container-fluid min-vh-100 ">
        <header>
          <Button className="mt-2" onClick={() => navigate("/")}>
            Volver Inicio
          </Button>
        </header>
        <nav className="row align-content-center justify-content-center ">
          <div
            className="col-11 col-sm-10 col-md-8 col-lg-5 my-5 rounded-3"
            style={{ backgroundColor: "white" }}
          >
            <RegisterStepper steps={STEPS} activeStep={activeStep} />
          </div>
        </nav>
        <main className="row d-flex  align-content-center justify-content-center ">
          <div
            className="col-11 col-sm-10 col-md-8 col-lg-5 h-100 rounded-1"
            style={{ backgroundColor: "white" }}
          >
            {register.isError ? (
              <Alert
                variant="danger"
                className="mx-5 mt-5 mb-0"
                dismissible
                closeLabel="Cerrar alerta"
                onClose={() => register.reset()}
              >
                {register.error.message}
                {register.error.details?.length ? (
                  <ul className="mt-2 mb-0 ps-3">
                    {register.error.details.map((detail, index) => (
                      <li key={`${detail.field}-${index}`}>{detail.message}</li>
                    ))}
                  </ul>
                ) : null}
              </Alert>
            ) : null}

            {activeStep === 0 ? (
              <PersonalDataStep
                initialValues={personal}
                onSubmit={handlePersonalSubmit}
              />
            ) : null}

            {activeStep === 1 ? (
              <AccountDataStep
                initialValues={account}
                onSubmit={handleAccountSubmit}
                onBack={handleBack}
              />
            ) : null}

            {activeStep === 2 ? (
              <BillingDataStep
                initialValues={billing}
                onSubmit={handleBillingSubmit}
                onBack={handleBack}
              />
            ) : null}
          </div>
        </main>
      </div>

      <BusyOverlay show={register.isPending} label="Creando tu cuenta..." />
    </>
  );
}
