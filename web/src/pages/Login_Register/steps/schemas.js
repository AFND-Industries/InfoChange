import * as yup from "yup";

import { endpoints } from "../../../lib/endpoints";

/**
 * Validacion del registro, dividida por pasos.
 *
 * Reproduce lo que comprueba `registerSchema` en el servidor: antes el
 * formulario exigia reglas distintas (8 caracteres y un simbolo en la
 * contrasena) de las que la API acepta, asi que se podia superar el ultimo paso
 * y recibir igualmente un error de validacion.
 */

const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;

/** Edad en anos a partir de una fecha "AAAA-MM-DD", o null si no es valida. */
function ageInYears(value) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return (Date.now() - date.getTime()) / MS_PER_YEAR;
}

async function isEmailAvailable(email) {
  try {
    const { available } = await endpoints.auth.checkEmail(email);
    return available;
  } catch {
    // Si la comprobacion no llega a completarse no se corta el registro: el
    // servidor vuelve a mirarlo al crear la cuenta.
    return true;
  }
}

export const personalSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .max(60, "El nombre no puede superar los 60 caracteres")
    .required("Por favor, ingrese su nombre"),
  lastName: yup
    .string()
    .trim()
    .max(80, "Los apellidos no pueden superar los 80 caracteres")
    .required("Por favor, ingrese sus apellidos"),
  birthDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, {
      message: "La fecha debe tener el formato AAAA-MM-DD",
      excludeEmptyString: true,
    })
    .test("age", "Debes tener al menos 18 años", (value) => {
      const age = ageInYears(value);
      return age === null ? true : age >= 18;
    })
    .test("plausible-age", "Por favor, revise su fecha de nacimiento", (value) => {
      const age = ageInYears(value);
      return age === null ? true : age <= 120;
    })
    .required("Por favor, ingrese su fecha de nacimiento"),
  gender: yup
    .string()
    .oneOf(["male", "female", "other"], "Por favor, seleccione su sexo")
    .required("Por favor, seleccione su sexo"),
});

export const accountSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Formato de correo electrónico inválido")
    .max(254, "El correo electrónico es demasiado largo")
    .test("check-email", "El correo electrónico ya está en uso", async (value) => {
      if (!value) return true;
      return isEmailAvailable(value);
    })
    .required("Por favor, ingrese su correo electrónico"),
  username: yup
    .string()
    .trim()
    .min(3, "El nombre de usuario debe tener entre 3 y 30 caracteres")
    .max(30, "El nombre de usuario debe tener entre 3 y 30 caracteres")
    .matches(/^[a-zA-Z0-9_-]+$/, {
      message:
        "Solo puede contener letras, números, guiones y guiones bajos",
      excludeEmptyString: true,
    })
    .required("Por favor, ingrese su nombre de usuario"),
  password: yup
    .string()
    .min(10, "La contraseña debe tener al menos 10 caracteres")
    .max(200, "La contraseña no puede superar los 200 caracteres")
    .matches(/[a-zA-Z]/, {
      message: "La contraseña debe combinar letras y números",
      excludeEmptyString: true,
    })
    .matches(/\d/, {
      message: "La contraseña debe combinar letras y números",
      excludeEmptyString: true,
    })
    .required("Por favor, ingrese su contraseña"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Las contraseñas deben coincidir")
    .required("Por favor, confirme su contraseña"),
  securityQuestionId: yup
    .string()
    .required("Por favor, seleccione una pregunta de seguridad"),
  securityAnswer: yup
    .string()
    .trim()
    .max(120, "La respuesta no puede superar los 120 caracteres")
    .required("Por favor, responda a la pregunta de seguridad"),
});

export const billingSchema = yup.object().shape({
  address: yup
    .string()
    .trim()
    .max(160, "La dirección no puede superar los 160 caracteres")
    .required("Por favor, introduzca su dirección"),
  country: yup.string().required("Por favor, seleccione su país"),
  city: yup
    .string()
    .trim()
    .max(80, "La ciudad no puede superar los 80 caracteres")
    .required("Por favor, introduzca su ciudad"),
  zipCode: yup
    .string()
    .trim()
    .matches(/^\d+$/, {
      message: "El codigo postal solo puede contener dígitos",
      excludeEmptyString: true,
    })
    .max(12, "El código postal no puede superar los 12 dígitos")
    .required("Por favor, introduzca su código postal"),
  phone: yup
    .string()
    .trim()
    .matches(/^\d+$/, {
      message: "El número de teléfono solo puede contener dígitos",
      excludeEmptyString: true,
    })
    .matches(/^\d{9}$/, {
      message: "El número de teléfono solo puede contener 9 dígitos",
      excludeEmptyString: true,
    })
    .required("Por favor, introduzca su número de teléfono"),
  documentId: yup
    .string()
    .trim()
    .max(40, "El número de identificación no puede superar los 40 caracteres")
    .required("Por favor, introduzca su numero de ID"),
  terms: yup.bool().oneOf([true], "Debes aceptar los términos y condiciones"),
});
