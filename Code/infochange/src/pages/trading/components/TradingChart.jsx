import React, { useEffect, useRef, useState } from 'react';

import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { useTrading } from '../context/TradingContext';

function TradingChart() {
    const { getActualPair, getChartMode, getPairPath } = useTrading();

    const container = useRef();

    const [newbieChart, setNewbieChart] = useState(null);
    const [proChart, setProChart] = useState(null);

    useEffect(() => {
        if (getActualPair() !== undefined) {
            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = JSON.stringify(
                {
                    symbols: getActualPair().symbol + "|7D",
                    width: "100%",
                    height: "100%",
                    locale: "es",
                    autosize: true,
                    hideMarketStatus: true,
                    scalePosition: "right",
                    scaleMode: "Normal",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "10",
                    noTimeScale: false,
                    valuesTracking: "1",
                    changeMode: "price-and-percent",
                    dateRanges: [
                        "1d|3",
                        "1w|30",
                        "1m|1H",
                        "3m|4H",
                        "6m|1D",
                        "12m|1D",
                        "all|1W"
                    ]
                });
            container.current.appendChild(script);

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

            return (() => {
                if (container.current != null)
                    container.current.innerHTML = "";
            });
        }
    }, [getActualPair()])

    return (
        <>
            {getActualPair() !== undefined ? // Si la moneda existe
                <>
                    <div className="border border-4 rounded tradingview-widget-container" ref={container}
                        style={{ height: "100%", width: "100%", display: (getChartMode() === 0 ? "block" : "none") }}>
                        <div className="tradingview-widget-container__widget"></div>
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