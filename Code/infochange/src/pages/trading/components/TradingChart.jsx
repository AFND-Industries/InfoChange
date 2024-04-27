import React, { useEffect, useState } from 'react';

import { useTrading } from '../context/TradingContext';
import SimpleChart from './SimpleChart';
import AdvancedChart from './AdvancedChart';

function TradingChart() {
    const { getActualPair, getChartMode, getPairPath } = useTrading();

    const [simpleChart, setSimpleChart] = useState(null);
    const [advancedChart, setAdvancedChart] = useState(null);

    useEffect(() => { // Actualizar graficos con el nuevo par, se puede eliminar esta forma cuando se quite el boton cambiar modo
        if (getActualPair() !== undefined) {
            setSimpleChart(<SimpleChart symbol={getActualPair().symbol} />);
            setAdvancedChart(<AdvancedChart symbol={getActualPair().symbol} />);
        }
    }, [getActualPair()])

    const renderNotFound = (
        <div className="border border-4 rounded d-flex align-items-center justify-content-center"
            style={{ height: "100%", width: "100%" }}>
            <div className="alert alert-danger">
                <span className="h3">El par {getPairPath()} no existe</span>
            </div>
        </div>
    );

    const renderChart = ( // Esto igual, se hace por el boton Cambiar Modo para que sea instantaneo, cuando se quite se puede simplificar
        <>
            <div className="border border-4 rounded tradingview-widget-container"
                style={{ height: "100%", width: "100%", display: (getChartMode() === 0 ? "block" : "none") }}>
                {simpleChart}
            </div>

            <div className="border border-4 rounded tradingview-widget-container"
                style={{ height: "100%", width: "100%", display: (getChartMode() === 1 ? "block" : "none") }}>
                {advancedChart}
            </div>
        </>
    );

    const renderContent = getActualPair() !== undefined ? renderChart : renderNotFound;

    return <>{renderContent}</>;
}

export default TradingChart;