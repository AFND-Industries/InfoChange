import { createChart } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import getChartStyle from '../models/ChartStyles';
import { useBitcoin } from '../contexts/BitcoinContext';

function BitcoinChart() {
    const { getBitcoinCandle } = useBitcoin();

    const chartContainerRef = useRef();

    const [styleIndex, setStyleIndex] = useState(0);
    const [newSeries, setnewSeries] = useState(null);

    const changeStyle = () => {
        setStyleIndex(prevStyle => (prevStyle + 1) % 2);
    }

    useEffect(() => {
        const { chartOptions, candleOptions } = getChartStyle(styleIndex);

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        };

        const chart = createChart(chartContainerRef.current, {});
        chart.timeScale().fitContent();

        const series = chart.addCandlestickSeries(candleOptions);
        setnewSeries(series);

        fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1000`)
            .then(res => res.json())
            .then(data => {
                const cdata = data.map(d => {
                    return { time: d[0] / 1000, open: parseFloat(d[1]), high: parseFloat(d[2]), low: parseFloat(d[3]), close: parseFloat(d[4]) }
                });

                series.setData(cdata);
                chart.applyOptions(chartOptions);
                handleResize();
            })

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