import React from "react";
import { useCoins } from "./contexts/CoinContext";

function CoinsPage() {
    const { getTokenInfo, getSymbolInfo } = useCoins();
    const faviconUrl = process.env.PUBLIC_URL + '/favicon.ico';

    const topCoins = [
        "BTC",
        "ETH",
        "BNB",
        "SOL",
        "XRP",
        "DOGE",
        "ADA",
        "AVAX",
        "SHIB",
        "DOT"
    ];

    const coinsObject = topCoins.map(coin => {
        const coinInfo = getTokenInfo(coin);

        return (
            <div className="d-flex align-items-center">
                <a href={"./price/" + coin.toUpperCase() + "USDT"} className="text-decoration-none">
                    <div className="container mt-2">
                        <img src={coinInfo.logo} className="img-fluid me-2 img-thumbnail"
                            style={{ width: '50px', height: '50px' }} onError={(e) => { e.target.src = faviconUrl; }} alt="Logo" />
                        <span className="text-dark h5 m-0">
                            {coinInfo.name}
                        </span>
                        <span className="text-secondary h6 m-0 ms-2">
                            {coin}
                        </span>
                    </div>
                </a>
            </div>);
    });


    return (
        <div>
            <header className="header bg-primary text-white py-3">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <a href="/" style={{ color: 'inherit', textDecoration: 'none' }} className="text-nowrap">
                                <span className="h1 m-0">InfoChange</span>
                            </a>
                        </div>
                    </div>
                </div>
            </header>
            <div className="container mt-3">
                {coinsObject}
            </div>
        </div>
    )
}

export default CoinsPage;