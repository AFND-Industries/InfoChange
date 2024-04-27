import React, { useEffect, useRef, useState } from 'react';

import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { useTrading } from '../context/TradingContext';
import SimpleChart from './SimpleChart';

function TradingChart() {
    const { getActualPair, getChartMode, getPairPath } = useTrading();

    const [newbieChart, setNewbieChart] = useState(null);
    const [proChart, setProChart] = useState(null);

    useEffect(() => {
        if (getActualPair() !== undefined) {
            setNewbieChart(<SimpleChart
                symbol={getActualPair().symbol}
            />);

            setProChart(<AdvancedRealTimeChart
                locale="es"
                autosize
                symbol={getActualPair().symbol}
                interval="1D"
                timezone="Etc/UTC"
                style={1}
                hide_top_toolbar={false}
                hide_side_toolbar={false}
                allow_symbol_change={false}
            />)
        }
    }, [getActualPair()])

    return (
        <>
            {getActualPair() !== undefined ? // Si la moneda existe
                <>
                    <div className="border border-4 rounded tradingview-widget-container"
                        style={{ height: "100%", width: "100%", display: (getChartMode() === 0 ? "block" : "none") }}>
                        {newbieChart}
                    </div>

                    <div className="border border-4 rounded tradingview-widget-container"
                        style={{ height: "100%", width: "100%", display: (getChartMode() === 1 ? "block" : "none") }}>
                        {proChart}
                    </div>
                </>
                : // Si la moneda no existe
                <>
                    <div className="border border-4 rounded d-flex align-items-center justify-content-center" ref={container}
                        style={{ height: "100%", width: "100%", display: (getChartMode() == 0 ? "block" : "none") }}>
                        <div className="alert alert-danger">
                            <span className="h3">El par {getPairPath()} no existe</span>
                        </div>
                    </div>
                </>}
        </>
    );
}

export default TradingChart;