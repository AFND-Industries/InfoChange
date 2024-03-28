import { createChart } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import getChartStyle from '../models/ChartStyles';
import { useAsset } from '../contexts/AssetContext';

function AssetChart() {
    const { getBitcoinCandle, getBitcoinPriceHistory, getDecimalPlaces, getTickSize } = useAsset();

    const chartContainerRef = useRef();
    const chartRef = useRef(null);
    const [priceHistory, setPriceHistory] = useState(null);
    const [styleIndex, setStyleIndex] = useState(0);

    const changeStyle = () => {
        setStyleIndex(prevStyle => (prevStyle + 1) % 2);
    }

    async function loadPriceHistory() {
        const priceHistory = await getBitcoinPriceHistory();
        setPriceHistory(priceHistory);
    }

    useEffect(() => {
        const tickSize = getTickSize();
        if (chartRef.current != null && tickSize.decimalPlaces >= 0) {
            chartRef.current.applyOptions({
                priceFormat: {
                    type: 'price',
                    precision: tickSize.decimalPlaces,
                    minMove: tickSize.step,
                },
            });
        }
    }, [getTickSize()])

    useEffect(() => {
        loadPriceHistory(); // poner que las velas que se vayan agregando con el addCandle se metan dentro de este priceHistory
    }, [])

    useEffect(() => {
        if (chartRef.current != null && priceHistory != null)
            chartRef.current.setData(priceHistory);
    }, [priceHistory])

    useEffect(() => {
        const { chartOptions, candleOptions } = getChartStyle(styleIndex);

        const chart = createChart(chartContainerRef.current, chartOptions);
        const handleResize = () => chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        //chart.timeScale().fitContent();
        handleResize();

        const series = chart.addCandlestickSeries(candleOptions);

        if (priceHistory != null)
            series.setData(priceHistory);

        chartRef.current = series;

        window.addEventListener('resize', handleResize);

        return () => {
            setPriceHistory(series.data());
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [styleIndex]);

    useEffect(() => {
        const newCandle = getBitcoinCandle();
        if (chartRef.current && newCandle != null && priceHistory != null) {
            chartRef.current.update(newCandle); // añadir la vela tambien a priceHistory
        }
    }, [getBitcoinCandle, priceHistory])

    return (
        <div className="container position-relative">
            <div className="row justify-content-md-center mb-5">
                <div style={{ position: 'relative' }}>
                    <button className="btn btn-primary mb-2 position-absolute" style={{ zIndex: 100, left: 23, top: 10 }} type="button" onClick={changeStyle}>Cambiar estilo</button>
                    <div
                        ref={chartContainerRef}
                    />
                </div>
            </div>
        </div>
    );
};

export default AssetChart;
