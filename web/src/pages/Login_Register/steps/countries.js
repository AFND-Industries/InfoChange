import countries from "../../../assets/countries.json";

/**
 * Listado de paises del formulario. El fichero se importaba dos veces en el
 * mismo modulo, con dos nombres distintos; aqui se carga una sola vez.
 */
export const COUNTRIES = countries;

/**
 * Prefijo telefonico del pais, o cadena vacia si no se reconoce.
 *
 * El prefijo se pega al numero al enviar el formulario, asi que hay que
 * normalizarlo: tres paises del fichero lo traen vacio (devolvian un "+" suelto
 * y un telefono "+600123456") y una veintena lo traen como cadena con un espacio
 * dentro ("1 242"), que producia numeros como "+1 242600123456".
 */
export function dialCodeFor(countryName) {
  const match = countries.find((country) => country.name === countryName);
  if (!match) return "";

  const code = String(match.phone_code).replace(/\s+/g, "");
  return code ? `+${code}` : "";
}
