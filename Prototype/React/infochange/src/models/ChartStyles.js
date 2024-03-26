import { ColorType } from "lightweight-charts";

const styles = [
    {
        chartOptions: {
            width: 1500,
            height: 600,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            }
        },
        candleOptions: {

        }
    },
    {
        chartOptions: {
            width: 1500,
            height: 600,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
            grid: {
                horzLines: {
                    visible: false,
                },
                vertLines: {
                    visible: false,
                }
            },
            layout: {
                background: {
                    type: ColorType.Solid,
                    color: "rgba(181,235,245,255)"
                }

            }
        },
        candleOptions: {
            upColor: '#1c49cc',
            downColor: '#b62022',
            borderDownColor: '#b62022',
            borderUpColor: '#1c49cc',
            wickDownColor: '#b62022',
            wickUpColor: '#1c49cc',
        }
    }
]

function getChartStyle(styleIndex = 0) {
    return styles[styleIndex];
}

export default getChartStyle;