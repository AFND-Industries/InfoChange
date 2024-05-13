import React from "react";

import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

function AdvancedChart({ symbol }) {
    return (
        <AdvancedRealTimeChart
            locale="es"
            autosize
            symbol={symbol}
            interval="1D"
            timezone="Etc/UTC"
            style={1}
            hide_top_toolbar={false}
            hide_side_toolbar={false}
            allow_symbol_change={false}
        />
    );
}

export default AdvancedChart;