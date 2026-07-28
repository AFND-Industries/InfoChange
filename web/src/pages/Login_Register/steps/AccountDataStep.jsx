import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Row from "react-bootstrap/Row";
import Tooltip from "react-bootstrap/Tooltip";
import * as Icons from "react-bootstrap-icons";
import { Formik } from "formik";

import { useSecurityQuestions } from "../../../hooks/useSession";
import FormErrorAlert from "./FormErrorAlert";
import { accountSchema } from "./schemas";

export default function AccountDataStep({ initialValues, onSubmit, onBack }) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    data: questions,
    isPending: questionsPending,
    error: questionsError,
  } = useSecurityQuestions();

  const togglePasswordVisibility = () => setShowPassword((visible) => !visible);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {showPassword ? "Ocultar Contraseña" : "Ver Contraseña"}
    </Tooltip>
  );

  return (
    <Formik
      validationSchema={accountSchema}
      onSubmit={onSubmit}
      initialValues={initialValues}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ handleSubmit, handleChange, values, touched, errors, submitCount }) => (
        <Form className="mx-5 my-5" noValidate onSubmit={handleSubmit}>
          <h1 className="fs-3 fw-bold">Informacion sobre la cuenta</h1>
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationEmail">
              <Form.Label>Correo Electronico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                isValid={touched.email && !errors.email}
                isInvalid={!!errors.email}
                aria-invalid={errors.email ? "true" : undefined}
                aria-describedby={errors.email ? "EmailError" : undefined}
                aria-required="true"
              />
              <Form.Control.Feedback type="invalid" id="EmailError">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationUsername">
              <Form.Label>Nombre de usuario</Form.Label>

              <Form.Control
                type="text"
                name="username"
                value={values.username}
                onChange={handleChange}
                isInvalid={!!errors.username}
                aria-invalid={errors.username ? "true" : undefined}
                aria-describedby={
                  errors.username ? "usernameError" : "infousername"
                }
                aria-required="true"
              />
              <small className="ml-2 text-muted" id="infousername">
                Este nombre te identificará dentro de infoChange
              </small>
              <Form.Control.Feedback type="invalid" id="usernameError">
                {errors.username}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationPassword">
              <Form.Label>Contraseña</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  aria-invalid={errors.password ? "true" : undefined}
                  aria-describedby={
                    errors.password ? "passwordError" : "infopassword"
                  }
                  aria-required="true"
                />
                <div>
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                  >
                    <Button
                      type="button"
                      variant="dark"
                      onClick={togglePasswordVisibility}
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showPassword ? <Icons.Eye /> : <Icons.EyeSlash />}
                    </Button>
                  </OverlayTrigger>
                </div>
                <Form.Control.Feedback type="invalid" id="passwordError">
                  {errors.password}
                </Form.Control.Feedback>
              </InputGroup>
              <small className="ml-2 text-muted" id="infopassword">
                Debe tener minimo 10 caracteres y combinar letras y números.
              </small>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationRepeatPassword">
              <Form.Label>Repite tu Contraseña</Form.Label>

              <Form.Control
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                isInvalid={!!errors.confirmPassword}
                aria-invalid={errors.confirmPassword ? "true" : undefined}
                aria-describedby={
                  errors.confirmPassword ? "confirmPasswordError" : undefined
                }
                aria-required="true"
              />

              <Form.Control.Feedback type="invalid" id="confirmPasswordError">
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
                name="securityQuestionId"
                value={values.securityQuestionId}
                onChange={handleChange}
                disabled={questionsPending || !!questionsError}
                isInvalid={!!errors.securityQuestionId}
                aria-invalid={errors.securityQuestionId ? "true" : undefined}
                aria-describedby={
                  errors.securityQuestionId ? "secureQuestionError" : undefined
                }
                aria-required="true"
              >
                <option value="">
                  {questionsPending
                    ? "Cargando preguntas..."
                    : "Seleccione una opción"}
                </option>
                {questions?.map((question) => (
                  <option key={question.id} value={String(question.id)}>
                    {question.prompt}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid" id="secureQuestionError">
                {errors.securityQuestionId}
              </Form.Control.Feedback>
              {questionsError ? (
                <Alert variant="warning" className="mt-2 mb-0 py-2 small">
                  {questionsError.message}
                </Alert>
              ) : null}
            </Form.Group>
            <Form.Group
              as={Col}
              md="12"
              controlId="validationSecurityQuestionText"
            >
              <Form.Label>Respuesta:</Form.Label>
              <Form.Control
                type="text"
                name="securityAnswer"
                value={values.securityAnswer}
                onChange={handleChange}
                isInvalid={!!errors.securityAnswer}
                aria-invalid={errors.securityAnswer ? "true" : undefined}
                aria-describedby={
                  errors.securityAnswer ? "secureQuestionTextError" : undefined
                }
                aria-required="true"
              />

              <Form.Control.Feedback type="invalid" id="secureQuestionTextError">
                {errors.securityAnswer}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <FormErrorAlert submitCount={submitCount} errors={errors} />

          <div className="d-flex justify-content-center">
            <Button
              type="button"
              className="mx-1"
              onClick={onBack}
              variant="outline-primary"
            >
              Paso Anterior
            </Button>
            <Button className="mx-1" type="submit">
              Siguiente Paso
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
