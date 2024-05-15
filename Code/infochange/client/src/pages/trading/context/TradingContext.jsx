import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useAPI } from "../../../context/APIContext";

const TradingContext = createContext();

// Cuando haya backend siempre activo, hacer que se pidan los precios cada X tiempo y se guarde con su time actual asi se puede
// conseguir que haya siempre el % cambio, el mini grafico de las monedas con puntos random y cosas asi jeje

// SI VAS A UN SITIO Y TE PIDE LOGEARTE PUES QUE DESPUES DE LOGEARTE TE LLEVE A ESE SITIO
// FILTRAR MONEDAS QUE NO ESTA NEN TRADING VIEW
// ARREGLAR LO DE QUE PUEDES REGISTRARTE EN TRADING VIEW DESDE INFOCHANGE

// SOPORTE CON PAYMENT SI NO TIENES SALDO DISPONIBLE LLEVAR A PAYMENT
// DISEÑO RESPONSIVE
// ELIMINAR LA DATA DUPLICADA

// HACER PANEL PARA ADMIN CON TODA LA COMISION QUE HA GANAO UNA TABLA ADMIN ALGO ASI WAPO WAPO
// cambiar modo, cambiar grafico, posicion del marquee configurable

const LOSIGUIENTE = 1;
// infobizum
// poner lop de cargando como compoennete y que tmb esté en payment
// MOSTRAR EN TRADING ANTES Q HACER FAVORITOS LA LISTA DE MONEDAS QUE TIENES
// boton en trading para ver historial?
// diseño responsive como en binance qe en el movil tiene uno que swapeas a comprar y otro q swapeas a vender
// boton historial ahi tmb q swapee entre comprar e historial
// historial de ingresos y retiros
// historial de bizums
// hints en trading, minimo y maximo

export const TradingProvider = ({ children }) => {
    const { getPair, getPairPrice } = useAPI();

    const params = useParams();
    const pairPath = params.pair === undefined ? "BTCUSDT" : params.pair.toUpperCase();
    const getPairPath = () => pairPath;

    const [actualPair, setActualPair] = useState(getPair(pairPath));
    const getActualPair = () => actualPair;
    const getActualPairPrice = () => getActualPair() === undefined ? -1 : getPairPrice(actualPair.symbol);

    const [mode, setMode] = useState(0);
    const getTradingMode = () => mode;
    const changeChartMode = () => setMode(mode => (mode + 1) % 2);

    useEffect(() => {
        if (getActualPair() !== undefined)
            window.history.replaceState(null, null, "/trading/" + getActualPair().symbol);
    }, [getActualPair()]);

    return (
        <TradingContext.Provider
            value={{
                getActualPair,
                setActualPair,
                getActualPairPrice,
                getTradingMode,
                changeChartMode,
                getPairPath
            }}
        >
            {children}
        </TradingContext.Provider>
    );
}

export const useTrading = () => useContext(TradingContext);