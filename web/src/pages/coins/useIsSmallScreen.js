import { useEffect, useState } from "react";

/** El diseno pasa a una sola columna por debajo del punto de corte `lg`. */
const QUERY = "(max-width: 989.98px)";

/**
 * Antes esto se resolvia leyendo `window.innerWidth` en cada evento `resize`;
 * `matchMedia` solo avisa cuando se cruza el umbral.
 */
export function useIsSmallScreen() {
  const [isSmall, setIsSmall] = useState(() => window.matchMedia(QUERY).matches);

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const onChange = (event) => setIsSmall(event.matches);

    setIsSmall(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isSmall;
}
