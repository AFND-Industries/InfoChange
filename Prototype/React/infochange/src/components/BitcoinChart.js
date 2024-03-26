import { createChart } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import getChartStyle from '../models/ChartStyles';
import { useBitcoin } from '../contexts/BitcoinContext';

function BitcoinChart() {
    const { getBitcoinCandle, getBitcoinPriceHistory } = useBitcoin();

    const chartContainerRef = useRef();

    const [styleIndex, setStyleIndex] = useState(0);
    const [newSeries, setnewSeries] = useState(null);

    const changeStyle = () => {
        setStyleIndex(prevStyle => (prevStyle + 1) % 2);
    }

    async function loadPriceHistory(series, chart, chartOptions, handleResize) {
        const priceHistory = await getBitcoinPriceHistory();

        series.setData(priceHistory);
        chart.applyOptions(chartOptions);
        //chart.timeScale().fitContent();
        handleResize();
    }

    useEffect(() => {
        const { chartOptions, candleOptions } = getChartStyle(styleIndex);

        const handleResize = () => chart.applyOptions({ width: chartContainerRef.current.clientWidth });

        const chart = createChart(chartContainerRef.current, {});
        const series = chart.addCandlestickSeries(candleOptions);
        setnewSeries(series);

        loadPriceHistory(series, chart, chartOptions, handleResize);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [styleIndex]);

    useEffect(() => {
        const newCandle = getBitcoinCandle();
        if (newSeries != null && newCandle != null) {
            newSeries.update(newCandle);
        }
    }, [getBitcoinCandle, newSeries])
    // Si ponemos getBitcoinCandle en vez de getBitcoinCandle() se actualiza cada vez que lo mas rapido
    // que es price, y aunque de momento no es correcto, es la forma de hacerlo tiempo real

    return (
        <div className="container">
            <button className="btn btn-primary mb-2" type="button" onClick={changeStyle}>Cambiar estilo</button>
            <div className="row justify-content-md-center mb-5">
                <div className="col-12">
                    <div
                        ref={chartContainerRef}
                    />
                </div>
            </div>
        </div>
    );
};

export default BitcoinChart;