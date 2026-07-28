import Spinner from 'react-bootstrap/Spinner';

import { useTrading } from '../context/TradingContext';
import SimpleChart from './SimpleChart';
import AdvancedChart from './AdvancedChart';

const boxClassName = "border border-4 rounded d-flex align-items-center justify-content-center";
const boxStyle = { height: "100%", width: "100%" };

function TradingChart() {
    const { pair, symbol, mode, isLoading, error } = useTrading();

    if (isLoading) {
        return (
            <div className={boxClassName} style={boxStyle}>
                <Spinner animation="border" role="status" variant="primary" />
                <span className="visually-hidden">Cargando el par</span>
            </div>
        );
    }

    // Que no se pueda leer el catalogo de pares no significa que el par no
    // exista: el mensaje del error ya viene redactado.
    if (error) {
        return (
            <div className={boxClassName} style={boxStyle}>
                <div className="alert alert-danger">
                    <span className="h3">{error.message}</span>
                </div>
            </div>
        );
    }

    if (pair === undefined) {
        return (
            <div className={boxClassName} style={boxStyle}>
                <div className="alert alert-danger">
                    <span className="h3">El par {symbol} no existe</span>
                </div>
            </div>
        );
    }

    // Solo se monta el grafico del modo activo. Antes se montaban los dos y se
    // ocultaba uno con `display: none` para que el boton de cambiar de modo
    // fuese instantaneo; ese boton ya no esta en esta pantalla y cargar dos
    // widgets de TradingView a la vez no sale gratis.
    return (
        <div className="border border-4 rounded tradingview-widget-container" style={boxStyle}>
            {mode === 0
                ? <SimpleChart key={pair.symbol} symbol={pair.symbol} />
                : <AdvancedChart key={pair.symbol} symbol={pair.symbol} />}
        </div>
    );
}

export default TradingChart;
