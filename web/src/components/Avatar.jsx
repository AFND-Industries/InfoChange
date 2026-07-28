import { useState } from "react";

/**
 * Foto de perfil de un usuario.
 *
 * Se sigue usando el avatar publico de GitHub, que es lo que hacia la version
 * original, pero con dos cambios: la imagen de respaldo es local en vez de una
 * URL a un banco de imagenes externo copiada y pegada en cinco ficheros (si ese
 * dominio dejaba de responder, el hueco se quedaba vacio o girando para
 * siempre), y el componente esta en un solo sitio.
 *
 * Ojo: pedir la imagen a github.com revela el nombre de usuario a un tercero.
 * Se mantiene por fidelidad al diseno original; para quitarlo bastaria con usar
 * siempre `FALLBACK`.
 */
const FALLBACK = "/usuario-anonimo.png";

export default function Avatar({ username, size = 48, className = "", rounded = true }) {
  const [failed, setFailed] = useState(false);

  const source = failed || !username ? FALLBACK : `https://github.com/${username}.png`;

  return (
    <img
      src={source}
      alt={username ? `Foto de perfil de ${username}` : "Foto de perfil"}
      width={size}
      height={size}
      loading="lazy"
      className={`${rounded ? "rounded-circle" : ""} ${className}`.trim()}
      style={{ width: size, height: size, objectFit: "cover" }}
      // El guardia evita el bucle infinito si tampoco cargase la imagen local.
      onError={() => {
        if (!failed) setFailed(true);
      }}
    />
  );
}
