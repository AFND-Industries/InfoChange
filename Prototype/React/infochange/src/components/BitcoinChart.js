import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import getChartStyle from "../models/ChartStyles";

function BitcoinChart() {
    //const [styleIndex, setStyle] = useState(0);

    const chartContainerRef = useRef();
    const chart = useRef();
    const resizeObserver = useRef();

    // const onChangeStyle = () => {
    //setStyle(prevStyle => (prevStyle + 1) % 2)
    //}

    useEffect(() => {
        const { chartOptions, candleOptions } = getChartStyle(0);

        chart.current = createChart(chartContainerRef.current, chartOptions);
        const candleSeries = chart.current.addCandlestickSeries(candleOptions);

        fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1w&limit=1000`)
            .then(res => res.json())
            .then(data => {
                const cdata = data.map(d => {
                    return { time: d[0] / 1000, open: parseFloat(d[1]), high: parseFloat(d[2]), low: parseFloat(d[3]), close: parseFloat(d[4]) }
                });
                candleSeries.setData(cdata);
            })
            .catch(err => console.log(err))

        const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_1w");
        ws.onmessage = (event) => {
            const d = JSON.parse(event.data);
            const pl = { time: d.k.t.toFixed(0) / 1000, open: parseFloat(d.k.o), high: parseFloat(d.k.h), low: parseFloat(d.k.l), close: parseFloat(d.k.c) }
            candleSeries.update(pl);
        };
    }, []);

    // Resize chart on container resizes.
    useEffect(() => {
        resizeObserver.current = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            chart.current.applyOptions({ width, height });
            setTimeout(() => {
                chart.current.timeScale().fitContent();
            }, 0);
        });

        resizeObserver.current.observe(chartContainerRef.current);

        return () => resizeObserver.current.disconnect();
    }, []);

    return (
        <div className="container">
            <div className="row justify-content-md-center mb-5">
                <div className="col-12">
                    <div
                        ref={chartContainerRef}
                        className="chart-container"
                    />
                </div>
            </div>
        </div>
    );
}

export default BitcoinChart;
