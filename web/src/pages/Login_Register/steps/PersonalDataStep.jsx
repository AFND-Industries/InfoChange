import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Formik } from "formik";

import FormErrorAlert from "./FormErrorAlert";
import { personalSchema } from "./schemas";

/** Los valores viajan a la API tal cual: "male" | "female" | "other". */
const GENDERS = [
  { value: "male", label: "Masculino", id: "inline-radio-1" },
  { value: "female", label: "Femenino", id: "inline-radio-2" },
  { value: "other", label: "Prefiero no decirlo", id: "inline-radio-3" },
];

export default function PersonalDataStep({ initialValues, onSubmit }) {
  return (
    <Formik
      validationSchema={personalSchema}
      onSubmit={onSubmit}
      initialValues={initialValues}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ handleSubmit, handleChange, values, errors, submitCount }) => (
        <Form className="mx-5 my-5" noValidate onSubmit={handleSubmit}>
          <h1 className="fs-3 fw-bold">Informacion Personal</h1>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="validationname">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                isInvalid={!!errors.firstName}
                value={values.firstName}
                onChange={handleChange}
                aria-invalid={errors.firstName ? "true" : undefined}
                aria-describedby={errors.firstName ? "nameError" : undefined}
                aria-required="true"
              />
              <Form.Control.Feedback type="invalid" id="nameError">
                {errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="8" controlId="validationLastName">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                isInvalid={!!errors.lastName}
                value={values.lastName}
                onChange={handleChange}
                aria-invalid={errors.lastName ? "true" : undefined}
                aria-describedby={errors.lastName ? "lastNameError" : undefined}
                aria-required="true"
              />
              <Form.Control.Feedback type="invalid" id="lastNameError">
                {errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationBirthday">
              <Form.Label>Fecha de nacimiento</Form.Label>
              <Form.Control
                type="date"
                name="birthDate"
                value={values.birthDate}
                onChange={handleChange}
                isInvalid={!!errors.birthDate}
                aria-invalid={errors.birthDate ? "true" : undefined}
                aria-describedby={errors.birthDate ? "birthdayError" : undefined}
                aria-required="true"
              />
              <Form.Control.Feedback type="invalid" id="birthdayError">
                {errors.birthDate}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-5">
            <Form.Group as={Col} md="12">
              <fieldset>
                <legend style={{ fontSize: "1.1rem" }}>Sexo:</legend>
                <div
                  key="inline-radio"
                  className="d-flex justify-content-between"
                >
                  {GENDERS.map((gender) => (
                    <Form.Check
                      key={gender.value}
                      inline
                      label={gender.label}
                      name="gender"
                      type="radio"
                      value={gender.value}
                      checked={values.gender === gender.value}
                      onChange={handleChange}
                      isInvalid={!!errors.gender}
                      aria-invalid={errors.gender ? "true" : undefined}
                      aria-describedby={errors.gender ? "sexoError" : undefined}
                      id={gender.id}
                    />
                  ))}
                </div>
                {errors.gender ? (
                  <Form.Control.Feedback
                    type="invalid"
                    className="d-block"
                    id="sexoError"
                  >
                    {errors.gender}
                  </Form.Control.Feedback>
                ) : null}
              </fieldset>
            </Form.Group>
          </Row>

          <FormErrorAlert submitCount={submitCount} errors={errors} />

          <div className="d-flex justify-content-center">
            <Button type="submit">Siguiente Paso</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
