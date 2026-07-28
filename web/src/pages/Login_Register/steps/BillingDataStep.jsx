import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { Formik } from "formik";

import { COUNTRIES, dialCodeFor } from "./countries";
import FormErrorAlert from "./FormErrorAlert";
import { billingSchema } from "./schemas";

export default function BillingDataStep({ initialValues, onSubmit, onBack }) {
  return (
    <Formik
      validationSchema={billingSchema}
      onSubmit={onSubmit}
      initialValues={initialValues}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        errors,
        submitCount,
        isSubmitting,
      }) => (
        <Form className="mx-5 my-5" noValidate onSubmit={handleSubmit}>
          <h1 className="fs-3 fw-bold">Datos de facturacion</h1>
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationAddress">
              <Form.Label>Direccion</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={values.address}
                onChange={handleChange}
                isInvalid={!!errors.address}
                aria-invalid={errors.address ? "true" : undefined}
                aria-describedby={errors.address ? "direccionError" : undefined}
                aria-required="true"
              />
              <Form.Control.Feedback type="invalid" id="direccionError">
                {errors.address}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="5" controlId="validationCountry">
              <Form.Label>País</Form.Label>
              <Form.Select
                name="country"
                value={values.country}
                onChange={handleChange}
                isInvalid={!!errors.country}
                aria-invalid={errors.country ? "true" : undefined}
                aria-describedby={errors.country ? "paisError" : undefined}
                aria-required="true"
              >
                <option value="">Seleccione su país</option>
                {COUNTRIES.map((country) => (
                  <option key={country.iso2} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid" id="paisError">
                {errors.country}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCity">
              <Form.Label>Ciudad</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={values.city}
                onChange={handleChange}
                isInvalid={!!errors.city}
                aria-invalid={errors.city ? "true" : undefined}
                aria-describedby={errors.city ? "ciudadError" : undefined}
                aria-required="true"
              />
              <Form.Control.Feedback type="invalid" id="ciudadError">
                {errors.city}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationPostalCode">
              <Form.Label>Codigo Postal</Form.Label>
              <Form.Control
                type="text"
                name="zipCode"
                value={values.zipCode}
                onChange={handleChange}
                isInvalid={!!errors.zipCode}
                aria-invalid={errors.zipCode ? "true" : undefined}
                aria-describedby={
                  errors.zipCode ? "codigoPostalError" : undefined
                }
                aria-required="true"
              />

              <Form.Control.Feedback type="invalid" id="codigoPostalError">
                {errors.zipCode}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="7" controlId="validationPhone">
              <Form.Label>Numero de telefono</Form.Label>
              <InputGroup>
                {/* El prefijo sale del pais elegido y se envia junto al numero. */}
                <InputGroup.Text>{dialCodeFor(values.country)}</InputGroup.Text>
                <Form.Control
                  type="text"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  isInvalid={!!errors.phone}
                  aria-invalid={errors.phone ? "true" : undefined}
                  aria-describedby={errors.phone ? "telefonoError" : undefined}
                  aria-required="true"
                />
                <Form.Control.Feedback type="invalid" id="telefonoError">
                  {errors.phone}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md="5" controlId="validationID">
              <Form.Label>Numero de identificacion</Form.Label>

              <Form.Control
                type="text"
                name="documentId"
                value={values.documentId}
                onChange={handleChange}
                isInvalid={!!errors.documentId}
                aria-invalid={errors.documentId ? "true" : undefined}
                aria-describedby={errors.documentId ? "IDError" : "IDInfo"}
                aria-required="true"
              />
              <small className="ml-2 text-muted" id="IDInfo">
                Por temas de seguridad, mas adelante te pediremos que verifiques
                tu identidad.
              </small>
              <Form.Control.Feedback type="invalid" id="IDError">
                {errors.documentId}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Form.Group className="mb-3">
            <Form.Check
              name="terms"
              label={
                <>
                  Acepto los{" "}
                  <a
                    href="https://icb.afndindustries.es/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    términos y condiciones
                  </a>
                </>
              }
              checked={values.terms}
              onChange={handleChange}
              isInvalid={!!errors.terms}
              feedback={errors.terms}
              feedbackType="invalid"
              id="validationTerms"
              aria-invalid={errors.terms ? "true" : undefined}
              aria-required="true"
            />
          </Form.Group>

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
            <Button type="submit" variant="success" disabled={isSubmitting}>
              Enviar
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
