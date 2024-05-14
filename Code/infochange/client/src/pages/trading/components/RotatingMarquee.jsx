import React from "react";

import "./RotatingMarquee.css";
import { useAPI } from "../../../context/APIContext";

const defaultPairs = [
    "BTCUSDT",
    "ETHUSDT",
    "LTCUSDT",
    "LINKUSDT",
    "DOTUSDT",
    "VITEUSDT"]

function RotatingMarquee({ display = true, pairs = [], floatingBottom = false }) {
    const { getPair, getTokenInfo } = useAPI();
    const actualPairs = pairs.length == 0 ? defaultPairs : pairs;

    const marquee = actualPairs.map((elem, i) => {
        const pair = getPair(elem);
        const tokenInfo = getTokenInfo(pair.baseAsset);

        return (
            <div key={i} className={`align-items-center col-2 bg-secondary rotating-marquee-element rme-${2 * i + 1}`}>
                <div className="d-flex flex-row align-items-center">
                    <img src={tokenInfo.logo} className="me-2"
                        style={{ width: '15px', height: '15px' }} onError={(e) => { e.target.src = '/favicon.ico'; }} alt="Logo" />
                    <div className="text-white marquee-pair"><b>{elem}</b></div>
                </div>
                <div className="text-warning"><b>{pair.price}</b></div>
            </div >
        );
    })



    return (
        <div className={(floatingBottom ? "floating-bottom " : "") + "rotating-marquee bg-secondary"}
            style={{ display: (display ? "block" : "none") }}>
            {marquee}
        </div >
    );
}

export default RotatingMarquee;