import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

function ChartOld() {
    const [bitcoinPriceHistory, setBitcoinPriceHistory] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        async function getBitcoinPriceHistory() {
            try {
                const response = await axios.get('https://api.binance.com/api/v3/klines', {
                    params: {
                        symbol: 'BTCUSDT',
                        interval: '1w',
                        limit: 500
                    }
                });

                const prices = response.data.map(data => parseFloat(data[4]));
                setBitcoinPriceHistory(prices);
            } catch (error) {
                console.error('Hubo un error al obtener el historial de precios de Bitcoin:', error);
            }
        }

        getBitcoinPriceHistory();
    }, []);

    useEffect(() => {
        const ctx = document.getElementById('bitcoinChart');

        if (bitcoinPriceHistory.length > 0) {
            if (chartRef.current !== null) {
                chartRef.current.destroy();
            }

            chartRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({ length: bitcoinPriceHistory.length }, (_, i) => i + 1),
                    datasets: [{
                        label: 'Precio de Bitcoin (USD)',
                        data: bitcoinPriceHistory,
                        borderColor: 'blue',
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Hora'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Precio (USD)'
                            }
                        }
                    }
                }
            });
        }
    }, [bitcoinPriceHistory]);

    return (
        <div className="container">
            <canvas id="bitcoinChart" width="800" height="400"></canvas>
        </div>
    );
}

export default ChartOld;
