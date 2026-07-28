/**
 * Datos iniciales compartidos por el script de seeding y por los tests, para
 * que las pruebas corran contra exactamente el mismo catalogo que produccion.
 */
export const SECURITY_QUESTIONS = [
  "¿Cual es el nombre de tu primera mascota?",
  "¿En que ciudad naciste?",
  "¿Cual es tu pelicula favorita?",
  "¿Como se llamaba tu primer colegio?",
  "¿Cual es el segundo apellido de tu madre?",
] as const;
