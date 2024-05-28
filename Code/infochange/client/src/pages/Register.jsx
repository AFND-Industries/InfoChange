import { Link, redirect, useNavigate } from "react-router-dom";
import Countries from "./../assets/countries.json";
import { useContext, useRef, useState, useEffect } from "react";
import "./login.css";
import Users from "./../data/users.json";
import { useAuth } from "./authenticator/AuthContext";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import countriesList from "../assets/countries.json"; // Supongamos que tienes una lista de países en un archivo separado
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Tooltip from "react-bootstrap/Tooltip";
import * as formik from "formik";
import * as yup from "yup";
import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import * as Icons from "react-bootstrap-icons";
import Typography from "@mui/material/Typography";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
const steps = [
  "Informacion Personal",
  "Informacion sobre la cuenta",
  "Datos de facturación",
];

export default function Register() {
  const [country, setCountry] = useState(Countries[0]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { doRegister } = useAuth();
  const { doCheckEmail } = useAuth();

  const [prefix, setPrefix] = useState("");
  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    const selectedCountryObject = countriesList.find(
      (country) => country.name === selectedCountry
    );
    const selectedCountryPrefix = selectedCountryObject
      ? `+${selectedCountryObject.phone_code}`
      : "";
    setPrefix(selectedCountryPrefix);
    handleChange(event); // Para que Formik también actualice el valor del campo 'pais'
  };
  const checkEmailExists = async (email) => {
    console.log(email);
    const response = await doCheckEmail(email);
    const status =
      response !== undefined && response.data !== undefined
        ? response.data.status
        : "";
    console.log(response);
    if (status === "0") {
      console.log(response.data.message);
      return false;
    } else if (status === "1") {
      console.log(response.data.message);
      return true;
    } else if (status === "-1") {
      console.log(response.data.message);
      return true;
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const [values1, setValues1] = useState(null);
  const [values2, setValues2] = useState(null);
  const [values3, setValues3] = useState(null);

  useEffect(() => {
    if (values1 !== null && values2 !== null && values3 !== null) {
      // Todas las variables están listas, puedes llamar a registerUser con los valores actualizados
      registerUser(values1, values2, values3);
    }
  }, [values1, values2, values3]);

  const registerUser = async (values1, values2, values3) => {
    let user = Object.assign({}, values1, values2, values3);
    console.log(user);

    const response = await doRegister(user);
    const status =
      response !== undefined && response.data !== undefined
        ? response.data.status
        : "";
    console.log(response);
    // if (status === "-1") {
    //   setError(response.data.cause);
    // } else if (status === "0") {
    //   setError("Usuario o contraseña incorrecta");
    // } else if (status === "1") {
    //   navigate("/dashboard");
    // } else {
    //
    //   setError("Error desconocido (por ahora)");
    // }
  };
  const { Formik } = formik;
  let emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<div>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const schema1 = yup.object().shape({
    name: yup.string().required("Por favor, ingrese su nombre"),
    lastName: yup.string().required("Por favor, ingrese sus apellidos"),
    birthday: yup
      .date()
      .required("Por favor, ingrese su fecha de nacimiento")
      .test("age", "Debes tener al menos 18 años", (value) => {
        if (!value) return false;
        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (
          monthDifference < 0 ||
          (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        return age >= 18;
      }),
    sexo: yup.string().required("Por favor, seleccione su sexo"),
  });
  const schema2 = yup.object().shape({
    username: yup.string().required("Por favor, ingrese su nombre de usuario"),
    email: yup
      .string()
      .email("Formato de correo electrónico inválido")
      .test(
        "check-email",
        "El correo electrónico ya está en uso",
        async function (value) {
          if (!value) return true;
          return await checkEmailExists(value);
        }
      )
      .required("Por favor, ingrese su correo electrónico"),
    password: yup
      .string()
      .required("Por favor, ingrese su contraseña")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(/[a-z]/, "Debe tener al menos una letra minúscula")
      .matches(/[A-Z]/, "Debe tener al menos una letra mayúscula")
      .matches(/[0-9]/, "Debe tener al menos un número")
      .matches(/[@$!%*?&]/, "Debe tener al menos un carácter especial"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Las contraseñas deben coincidir")
      .required("Por favor, confirme su contraseña"),
    secureQuestion: yup
      .string()
      .required("Por favor, seleccione una pregunta de seguridad")
      .oneOf(
        ["question1", "question2", "question3"],
        "Por favor, seleccione una pregunta de seguridad válida"
      ),
    secureQuestionText: yup
      .string()
      .required("Por favor, responda una pregunta de seguridad"),
  });
  const schema3 = yup.object().shape({
    direccion: yup.string().required("Por favor, introduzca su dirección"),
    ciudad: yup.string().required("Por favor, introduzca su ciudad"),
    codigoPostal: yup
      .string()
      .matches(/^\d+$/, "El codigo postal solo puede contener dígitos")
      .required("Por favor, introduzca su código postal"),
    pais: yup.string().required("Por favor, seleccione su país"),
    telefono: yup
      .string()
      .matches(/^\d+$/, "El número de teléfono solo puede contener dígitos")
      .matches(/^\d{9}$/, "El número de teléfono solo puede contener 9 dígitos")
      .required("Por favor, introduzca su número de teléfono"),
    ID: yup.string().required("Por favor, introduzca su numero de ID"),
    terms: yup.bool().oneOf([true], "Debes aceptar los términos y condiciones"),
  });
  const countries = countriesList.map((country) => (
    <option key={country.code} value={country.name}>
      {country.name}
    </option>
  ));
  const [activeStep, setActiveStep] = React.useState(0);

  const [showModal, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleNext = (values) => {
    console.log(values);
    console.log(activeStep);
    if (activeStep == 0) {
      setValues1({ ...values });
    }
    if (activeStep == 1) {
      setValues2({ ...values });
    }
    if (activeStep == 2) {
      setValues3({ ...values });
      handleShow();
    }
    if (activeStep < 3) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {showPassword ? "Ocultar Contraseña" : "Ver Contraseña"}
    </Tooltip>
  );
  return (
    <>
      <div className="anim_gradient container-fluid min-vh-100 ">
        <header>
          <Button className="mt-2" onClick={() => navigate("/")}>
            Volver Inicio
          </Button>
        </header>
        <banner className="row align-content-center justify-content-center ">
          <div
            className="col-11 col-sm-10 col-md-8 col-lg-5 my-5 rounded-3"
            style={{ backgroundColor: "white" }}
          >
            <Box className="my-2" sx={{ width: "100%" }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};

                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </Box>
          </div>
        </banner>
        <main className="row d-flex  align-content-center justify-content-center ">
          <div
            className="col-11 col-sm-10 col-md-8 col-lg-5 h-100 rounded-1"
            style={{ backgroundColor: "white" }}
          >
            {activeStep === 0 ? (
              <Formik
                validationSchema={schema1}
                onSubmit={(values) => handleNext(values)}
                initialValues={{
                  name: values1?.name || "",
                  lastName: values1?.lastName || "",
                  birthday: values1?.birthday || "",
                  sexo: values1?.sexo || "",
                }}
                enableReinitialize={true}
                validateOnChange={false}
                validateOnBlur={false}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  touched,
                  errors,
                  isValid,
                }) => (
                  <div>
                    <Form
                      className="mx-5  my-5"
                      noValidate
                      onSubmit={handleSubmit}
                    >
                      <h1 className="fs-3 fw-bold">Informacion Personal</h1>
                      <Row className="mb-3">
                        <Form.Group as={Col} md="4" controlId="validationname">
                          <Form.Label>Nombre</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            isInvalid={!!errors.name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.name}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="8"
                          controlId="validationLastName"
                        >
                          <Form.Label>Apellidos</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            isInvalid={!!errors.lastName}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.lastName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="validationBirthday"
                        >
                          <Form.Label>Fecha de nacimiento</Form.Label>
                          <Form.Control
                            type="date"
                            name="birthday"
                            value={values.birthday}
                            onChange={handleChange}
                            isInvalid={!!errors.birthday}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.birthday}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                      <Row className="mb-5">
                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="validationGender"
                        >
                          <fieldset>
                            <Form.Label>Sexo:</Form.Label>
                            <div
                              key="inline-radio"
                              className="d-flex justify-content-between"
                            >
                              <Form.Check
                                inline
                                label="Masculino"
                                name="sexo"
                                type="radio"
                                value={"mas"}
                                onChange={handleChange}
                                isInvalid={!!errors.sexo}
                                feedback={errors.sexo}
                                feedbackType="invalid"
                                id="inline-radio-1"
                              />
                              <Form.Check
                                inline
                                label="Femenino"
                                name="sexo"
                                type="radio"
                                value={"fem"}
                                onChange={handleChange}
                                isInvalid={!!errors.sexo}
                                feedback={errors.sexo}
                                feedbackType="invalid"
                                id="inline-radio-2"
                              />
                              <Form.Check
                                inline
                                label="Prefiero no decirlo"
                                name="sexo"
                                type="radio"
                                value={"NA"}
                                onChange={handleChange}
                                isInvalid={!!errors.sexo}
                                feedback={errors.sexo}
                                feedbackType="invalid"
                                id="inline-radio-3"
                              />
                            </div>
                          </fieldset>
                        </Form.Group>
                      </Row>
                      <div className="d-flex justify-content-center">
                        <Button type="submit">Siguiente Paso</Button>
                      </div>
                    </Form>
                  </div>
                )}
              </Formik>
            ) : null}

            {activeStep === 1 ? (
              <Formik
                validationSchema={schema2}
                onSubmit={(values) => handleNext(values)}
                initialValues={{
                  username: values2?.username || "",
                  email: values2?.email || "",
                  password: values2?.password || "",
                  confirmPassword: values2?.confirmPassword || "",
                  secureQuestion: values2?.secureQuestion || "",
                  secureQuestionText: values2?.secureQuestionText || "",
                }}
                enableReinitialize={true}
                validateOnChange={false}
                validateOnBlur={false}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  touched,
                  errors,
                  isValid,
                }) => (
                  <div>
                    <Form
                      className="mx-5  my-5"
                      noValidate
                      onSubmit={handleSubmit}
                    >
                      <h1 className="fs-3 fw-bold">
                        Informacion sobre la cuenta
                      </h1>
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="validationEmail"
                        >
                          <Form.Label>Correo Electronico</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            isValid={touched.email && !errors.email}
                            isInvalid={!!errors.email}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="validationUsername"
                        >
                          <Form.Label>Nombre de usuario</Form.Label>

                          <Form.Control
                            type="text"
                            name="username"
                            value={values.username}
                            onChange={handleChange}
                            isInvalid={!!errors.username}
                          />
                          <small className="ml-2 text-muted">
                            Este nombre te identificará dentro de infoChange
                          </small>
                          <Form.Control.Feedback type="invalid">
                            {errors.username}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationPassword"
                        >
                          <Form.Label>Contraseña</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={values.password}
                              onChange={handleChange}
                              isInvalid={!!errors.password}
                            />
                            <div>
                              <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltip}
                              >
                                <Button
                                  variant="dark"
                                  onClick={togglePasswordVisibility}
                                  aria-label={
                                    showPassword
                                      ? "Ocultar contraseña"
                                      : "Mostrar contraseña"
                                  }
                                >
                                  {showPassword ? (
                                    <Icons.Eye />
                                  ) : (
                                    <Icons.EyeSlash />
                                  )}
                                </Button>
                              </OverlayTrigger>
                            </div>
                          </InputGroup>
                          <small className="ml-2 text-muted">
                            Debe tener minimo 8 caracteres, una mayúscula, una
                            minúscula, un número y un carácter especial.
                          </small>

                          <Form.Control.Feedback type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationRepeatPassword"
                        >
                          <Form.Label>Repite tu Contraseña</Form.Label>

                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            isInvalid={!!errors.confirmPassword}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.confirmPassword}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                      <Row className="mb-5">
                        <Form.Group
                          className="mb-1"
                          as={Col}
                          md="12"
                          controlId="validationSecurityQuestion"
                        >
                          <Form.Label>Pregunta de seguridad:</Form.Label>
                          <Form.Select
                            name="secureQuestion"
                            value={values.secureQuestion}
                            onChange={handleChange}
                            isInvalid={!!errors.secureQuestion}
                          >
                            <option value="">Seleccione una opción</option>
                            <option value="question1">
                              ¿Cuál es el nombre de tu primera mascota?
                            </option>
                            <option value="question2">¿Dónde naciste?</option>
                            <option value="question3">
                              ¿Cuál fue tu mote en la escuela?
                            </option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.secureQuestion}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="validationSecurityQuestionText"
                        >
                          <Form.Label>Respuesta:</Form.Label>
                          <Form.Control
                            type="text"
                            name="secureQuestionText"
                            value={values.secureQuestionText}
                            onChange={handleChange}
                            isInvalid={!!errors.secureQuestionText}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.secureQuestionText}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                      <div className="d-flex justify-content-center">
                        <Button
                          className="mx-1"
                          onClick={handleBack}
                          variant="outline-primary"
                        >
                          Paso Anterior
                        </Button>
                        <Button className="mx-1" type="submit">
                          Siguiente Paso
                        </Button>
                      </div>
                    </Form>
                  </div>
                )}
              </Formik>
            ) : null}

            {activeStep === 2 ? (
              <Formik
                validationSchema={schema3}
                onSubmit={(values) => handleNext(values)}
                initialValues={{
                  direccion: values3?.direccion || "",
                  ciudad: values3?.ciudad || "",
                  codigoPostal: values3?.codigoPostal || "",
                  pais: values3?.pais || "",
                  telefono: values3?.telefono || "",
                  ID: values3?.ID || "",
                  terms: values3?.terms || false,
                }}
                enableReinitialize={true}
                validateOnChange={false}
                validateOnBlur={false}
              >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                  <div>
                    <Form
                      className="mx-5  my-5"
                      noValidate
                      onSubmit={handleSubmit}
                    >
                      <h1 className="fs-3 fw-bold">Datos de facturacion</h1>
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="validationAddress"
                        >
                          <Form.Label>Direccion</Form.Label>
                          <Form.Control
                            type="text"
                            name="direccion"
                            value={values.direccion}
                            onChange={handleChange}
                            isInvalid={!!errors.direccion}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.direccion}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="5"
                          controlId="validationCountry"
                        >
                          <Form.Label>País</Form.Label>
                          <Form.Select
                            name="pais"
                            value={values.pais}
                            onChange={(event) => {
                              handleChange(event);
                              handleCountryChange(event);
                            }}
                            isInvalid={!!errors.pais}
                          >
                            <option value="">Seleccione su país</option>
                            {countries}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.pais}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="validationCity">
                          <Form.Label>Ciudad</Form.Label>
                          <Form.Control
                            type="text"
                            name="ciudad"
                            value={values.ciudad}
                            onChange={handleChange}
                            isInvalid={!!errors.ciudad}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.ciudad}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="validationPostalCode"
                        >
                          <Form.Label>Codigo Postal</Form.Label>
                          <Form.Control
                            type="text"
                            name="codigoPostal"
                            value={values.codigoPostal}
                            onChange={handleChange}
                            isInvalid={!!errors.codigoPostal}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.codigoPostal}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Form.Group as={Col} md="7" controlId="validationPhone">
                          <Form.Label>Numero de telefono</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>{prefix}</InputGroup.Text>
                            <Form.Control
                              type="text"
                              name="telefono"
                              value={values.telefono}
                              onChange={handleChange}
                              isInvalid={!!errors.telefono}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.telefono}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md="5" controlId="validationID">
                          <Form.Label>Numero de identificacion</Form.Label>

                          <Form.Control
                            type="text"
                            name="ID"
                            value={values.ID}
                            onChange={handleChange}
                            isInvalid={!!errors.ID}
                          />
                          <small className="ml-2 text-muted">
                            Por temas de seguridad, mas adelante te pediremos
                            que verifiques tu identidad.
                          </small>
                          <Form.Control.Feedback type="invalid">
                            {errors.ID}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Check
                          required
                          name="terms"
                          label="Acepto los terminos y condiciones"
                          onChange={handleChange}
                          isInvalid={!!errors.terms}
                          feedback={errors.terms}
                          feedbackType="invalid"
                          id="validationTerms"
                        />
                      </Form.Group>
                      <div className="d-flex justify-content-center">
                        <Button
                          className="mx-1"
                          onClick={handleBack}
                          variant="outline-primary"
                        >
                          Paso Anterior
                        </Button>
                        <Button type="summit" variant="success">
                          Enviar
                        </Button>
                      </div>
                    </Form>
                  </div>
                )}
              </Formik>
            ) : null}
          </div>
        </main>
      </div>
      <Modal show={showModal}>
        <Modal.Header closeButton>
          <Modal.Title>¡Gracias por registrarte!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tu registro ha sido exitoso. ¡Bienvenido a nuestra comunidad!
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Link to="/">
            <Button variant="primary">Ir a inicio</Button>
          </Link>
          <Link to="/login">
            <Button variant="primary">Ir a Iniciar sesion</Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </>
  );
}
