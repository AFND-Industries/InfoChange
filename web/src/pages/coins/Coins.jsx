import { Route, Routes } from "react-router-dom";

import CoinInfo from "./CoinInfo";
import CoinsPage from "./CoinsPage";

/**
 * Punto de entrada de la seccion de monedas. Antes esta pantalla decidia que
 * mostrar leyendo `window.location.pathname` a mano; ahora son dos rutas
 * anidadas de react-router colgando de `/coins/*`.
 */
export default function Coins() {
  return (
    <Routes>
      <Route index element={<CoinsPage />} />
      <Route path=":symbol" element={<CoinInfo />} />
    </Routes>
  );
}
