import { createChart } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import getChartStyle from '../models/ChartStyles';
import { useAsset } from '../contexts/AssetContext';

function AssetChart() {
    const { getBitcoinCandle, getBitcoinPrice, getBitcoinPriceHistory, getActualSymbol, getTimeScale, setTimeScale } = useAsset();

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
        const actualSymbol = getActualSymbol();
        if (chartRef.current != null && actualSymbol.decimalPlaces >= 0) {
            chartRef.current.applyOptions({
                priceFormat: {
                    type: 'price',
                    precision: actualSymbol.decimalPlaces,
                    minMove: actualSymbol.step,
                },
            });
        }
    }, [getActualSymbol()])

    useEffect(() => {
        loadPriceHistory();
    }, [getTimeScale()])

    useEffect(() => {
        if (chartRef.current != null && priceHistory != null) {
            chartRef.current.setData(priceHistory);
        }

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
    }, [getBitcoinCandle(), getBitcoinPrice()])

    const timeScales = [
        "1m",
        "1h",
        "4h",
        "1d",
        "1w",
        "1M",
    ]

    let i = 0;
    const timeScaleButtons = timeScales.map(t => {
        i++;
        const isActive = getTimeScale() === t;
        const buttonStyle = {
            zIndex: 100,
            left: `${100 + i * 53}px`,
            top: '10px',
            width: '50px'
        };
        const buttonClass = `btn btn-primary mb-2 position-absolute${isActive ? ' bg-dark' : ''}`;

        return (
            <button
                className={buttonClass}
                style={buttonStyle}
                type="button"
                onClick={() => setTimeScale(t)}
                key={t}
            >
                {t}
            </button>
        );
    });




    return (
        <div className="container position-relative">
            <div className="row justify-content-md-center mb-5">
                <div style={{ position: 'relative' }}>
                    <button className="btn btn-primary mb-2 position-absolute" style={{ zIndex: 100, left: 23, top: 10 }} type="button" onClick={changeStyle}>Cambiar estilo</button>
                    {timeScaleButtons}
                    <div
                        ref={chartContainerRef}
                    />
                </div>
            </div>
        </div>
    );
};

export default AssetChart;
