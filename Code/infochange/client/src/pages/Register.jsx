import { Link, redirect, useNavigate } from "react-router-dom";
import Countries from "./../assets/countries.json";
import { useContext, useRef, useState } from "react";
import "./login.css";
import Users from "./../data/users.json";
import { useAuth } from "./authenticator/AuthContext";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import Row from "react-bootstrap/Row";
import * as formik from "formik";
import * as yup from "yup";
import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import Typography from "@mui/material/Typography";

const steps = ["Informacion Personal", "Informacion sobre la", "Create an ad"];

export default function Register() {
  const [country, setCountry] = useState(Countries[0]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { doRegister } = useAuth();
  const { doCheckEmail } = useAuth();
  const name = useRef(null);
  const surname = useRef(null);
  const user = useRef(null);
  const email = useRef(null);
  const phone = useRef(null);
  const _document = useRef(null);
  const address = useRef(null);
  const postalCode = useRef(null);
  const password = useRef(null);

  const checkEmailExists = async (email) => {
    const response = await doCheckEmail(email);
    const status =
      response !== undefined && response.data !== undefined
        ? response.data.status
        : "";

    if (status === "0") {
      console.log(response.data.message);
      return true;
    } else if (status === "1") {
      console.log(response.data.message);
      return false;
    } else if (status === "-1") {
      console.log(response.data.message);
      return true;
    }
  };

  const registerUser = async (user) => {
    console.log(user);
    const response = await doRegister(user);
    const status =
      response !== undefined && response.data !== undefined
        ? response.data.status
        : "";

    if (status === "-1") {
      setError(response.data.cause);
    } else if (status === "0") {
      setError("Usuario o contraseña incorrecta");
    } else if (status === "1") {
      navigate("/dashboard");
    } else {
      console.log(response);
      setError("Error desconocido (por ahora)");
    }
  };

  const { Formik } = formik;
  let emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<div>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const schema1 = yup.object().shape({
    firstName: yup.string().required("Por favor, ingrese su nombre"),
    lastName: yup.string().required("Por favor, ingrese sus apellidos"),
    birthday: yup.date().required("Por favor, ingrese su fecha de nacimiento"),
    sexo: yup.string().required("Por favor, seleccione su sexo"),
  });
  const schema2 = yup.object().shape({
    username: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    terms: yup
      .bool()
      .required()
      .oneOf([true], "Debe aceptar los terminos para continuar"),
    email: yup
      .string()
      .matches(emailRegex, "Formato de correo electrónico inválido")
      .required("Por favor, ingrese su correo electronico")
      .test(
        "unique-email",
        "Este correo electrónico ya está registrado",
        async function (value) {
          return !(await checkEmailExists(value));
        }
      ),
  });
  const schema3 = yup.object().shape({
    firstName: yup.string().required("Por favor, ingrese su nombre"),
    lastName: yup.string().required("Por favor, ingrese sus apellidos"),
    email: yup
      .string()
      .matches(emailRegex, "Formato de correo electrónico inválido")
      .required("Por favor, ingrese su correo electronico")
      .test(
        "unique-email",
        "Este correo electrónico ya está registrado",
        async function (value) {
          return !(await checkEmailExists(value));
        }
      ),
    birthday: yup.date().required("Por favor, ingrese su fecha de nacimiento"),
    sexo: yup.string().required("Por favor, seleccione su sexo"),
    username: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    terms: yup
      .bool()
      .required()
      .oneOf([true], "Debe aceptar los terminos para continuar"),
  });

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    if (activeStep < 2) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className="anim_gradient container-fluid min-vh-100 ">
      <div className="row align-content-center justify-content-center ">
        <div
          className="col-5 my-5 rounded-3"
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
      </div>
      <div className="row d-flex  align-content-center justify-content-center ">
        <div className="col-5 h-100" style={{ backgroundColor: "white" }}>
          {activeStep === 0 ? (
            <Formik
              validationSchema={schema1}
              onSubmit={console.log}
              initialValues={{
                firstName: "",
                lastName: "",
                birthday: "",
                sexo: "",
              }}
              validateOnChange={true}
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
                    onSubmit={(e) => {
                      e.preventDefault(); // Prevenir el envío del formulario por defecto
                      handleSubmit(); // Realizar la validación manualmente
                      if (Object.keys(errors).length === 0) {
                        // Si no hay errores, avanzar al siguiente paso
                        handleNext();
                      }
                    }}
                  >
                    <h3>Informacion Personal</h3>
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationFormik01"
                      >
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={values.firstName}
                          onChange={handleChange}
                          isInvalid={!!errors.firstName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.firstName}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="8"
                        controlId="validationFormik02"
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
                        controlId="validationFormik01"
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
                        controlId="validationFormik09"
                      >
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
                      </Form.Group>
                    </Row>

                    <Button type="submit">Siguiente Paso</Button>
                  </Form>
                </div>
              )}
            </Formik>
          ) : null}

          {activeStep === 1 ? (
            <Formik
              validationSchema={schema1}
              onSubmit={console.log}
              initialValues={{
                firstName: "",
                lastName: "",
                birthday: "",
                sexo: "",
              }}
            >
              {({ handleSubmit, handleChange, values, touched, errors }) => (
                <div>
                  {activeStep === 0 && (
                    <Form
                      className="mx-5  my-5"
                      noValidate
                      onSubmit={handleSubmit}
                    >
                      <h3>Informacion Personal</h3>
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationFormik01"
                        >
                          <Form.Label>Nombre</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            isInvalid={!!errors.firstName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.firstName}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="8"
                          controlId="validationFormik02"
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
                          controlId="validationFormik01"
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
                          controlId="validationFormik09"
                        >
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
                        </Form.Group>
                      </Row>

                      <Button onClick={handleNext}>Siguiente Paso</Button>
                    </Form>
                  )}
                  {activeStep === 1 && (
                    <Form
                      className="mx-5  my-5"
                      noValidate
                      onSubmit={handleSubmit}
                    >
                      <h3>Informacion sobre la cuenta</h3>
                      <Row className="mb-5">
                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="validationFormik01"
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
                          md="6"
                          controlId="validationFormik03"
                        >
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="City"
                            name="city"
                            value={values.city}
                            onChange={handleChange}
                            isInvalid={!!errors.city}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.city}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="validationFormik04"
                        >
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="State"
                            name="state"
                            value={values.state}
                            onChange={handleChange}
                            isInvalid={!!errors.state}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.state}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="validationFormik05"
                        >
                          <Form.Label>Zip</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Zip"
                            name="zip"
                            value={values.zip}
                            onChange={handleChange}
                            isInvalid={!!errors.zip}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.zip}
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
                          id="validationFormik0"
                        />
                        {/* <Row>
                      Acepto los{" "}
                      <a href="https://tus-terminos-y-condiciones.com">
                        términos y condiciones
                      </a>
                      <Form.Check
                        required
                        name="terms"
                        onChange={handleChange}
                        isInvalid={!!errors.terms}
                        feedback={errors.terms}
                        feedbackType="invalid"
                        id="validationFormik0"
                      />
                    </Row> */}
                      </Form.Group>
                      <Button type="" onClick={handleBack}>
                        Paso Anterior
                      </Button>
                      <Button onClick={handleNext}>Siguiente Paso</Button>
                    </Form>
                  )}
                  {activeStep === 2 && (
                    <Form
                      className="mx-5  my-5"
                      noValidate
                      onSubmit={handleSubmit}
                    >
                      <h3>Informacion sobre la cuenta</h3>
                      <Row className="mb-5">
                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="validationFormik01"
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
                          md="6"
                          controlId="validationFormik03"
                        >
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="City"
                            name="city"
                            value={values.city}
                            onChange={handleChange}
                            isInvalid={!!errors.city}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.city}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="validationFormik04"
                        >
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="State"
                            name="state"
                            value={values.state}
                            onChange={handleChange}
                            isInvalid={!!errors.state}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.state}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="validationFormik05"
                        >
                          <Form.Label>Zip</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Zip"
                            name="zip"
                            value={values.zip}
                            onChange={handleChange}
                            isInvalid={!!errors.zip}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.zip}
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
                          id="validationFormik0"
                        />
                        {/* <Row>
                      Acepto los{" "}
                      <a href="https://tus-terminos-y-condiciones.com">
                        términos y condiciones
                      </a>
                      <Form.Check
                        required
                        name="terms"
                        onChange={handleChange}
                        isInvalid={!!errors.terms}
                        feedback={errors.terms}
                        feedbackType="invalid"
                        id="validationFormik0"
                      />
                    </Row> */}
                      </Form.Group>
                      <Button type="" onClick={handleBack}>
                        Paso Anterior
                      </Button>
                      <Button type="submit" onClick={handleNext}>
                        Submit form
                      </Button>
                    </Form>
                  )}
                </div>
              )}
            </Formik>
          ) : null}
          {activeStep === 2 ? (
            <Formik
              validationSchema={schema2}
              onSubmit={console.log}
              initialValues={{
                firstName: "",
                lastName: "",
                birthday: "",
                sexo: "",
              }}
            >
              {({ handleSubmit, handleChange, values, touched, errors }) => (
                <div>
                  <Form
                    className="mx-5  my-5"
                    noValidate
                    onSubmit={handleSubmit}
                  >
                    <h3>Informacion sobre la cuenta</h3>
                    <Row className="mb-5">
                      <Form.Group
                        as={Col}
                        md="12"
                        controlId="validationFormik01"
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
                        md="6"
                        controlId="validationFormik03"
                      >
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="City"
                          name="city"
                          value={values.city}
                          onChange={handleChange}
                          isInvalid={!!errors.city}
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.city}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="validationFormik04"
                      >
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="State"
                          name="state"
                          value={values.state}
                          onChange={handleChange}
                          isInvalid={!!errors.state}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.state}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="validationFormik05"
                      >
                        <Form.Label>Zip</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Zip"
                          name="zip"
                          value={values.zip}
                          onChange={handleChange}
                          isInvalid={!!errors.zip}
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.zip}
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
                        id="validationFormik0"
                      />
                      {/* <Row>
                      Acepto los{" "}
                      <a href="https://tus-terminos-y-condiciones.com">
                        términos y condiciones
                      </a>
                      <Form.Check
                        required
                        name="terms"
                        onChange={handleChange}
                        isInvalid={!!errors.terms}
                        feedback={errors.terms}
                        feedbackType="invalid"
                        id="validationFormik0"
                      />
                    </Row> */}
                    </Form.Group>
                    <Button type="" onClick={handleBack}>
                      Paso Anterior
                    </Button>
                    <Button onClick={handleNext}>Siguiente Paso</Button>
                  </Form>
                </div>
              )}
            </Formik>
          ) : null}
        </div>
      </div>
    </div>
  );
}
