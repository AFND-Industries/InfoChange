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

        const index = 2 * i + 1;
        const nonenize = index == 3 || index == 7 || index == 11;

        return (
            <div key={i}
                style={{ backgroundColor: "#4E545A" }}
                className={`d-flex align-items-center justify-content-center col-2 rotating-marquee-element rme-${index} ${nonenize ? "hidden-md" : ""}`}>
                <div className="d-flex flex-row align-items-center">
                    <img src={tokenInfo.logo} className="me-2"
                        style={{ width: '15px', height: '15px' }} onError={(e) => { e.target.src = '/favicon.ico'; }} alt={"Loho de " + tokenInfo.name} />
                    <div className="text-white marquee-pair"><b>{elem}</b></div>
                </div>
                <div className="text-warning"><b>{pair.price}</b></div>
            </div >
        );
    })

    return (
        <div className={(floatingBottom ? "floating-bottom " : "") + "rotating-marquee"}
            style={{ display: (display ? "block" : "none"), backgroundColor: "#4E545A" }}>
            {marquee}
        </div >
    );
}

export default RotatingMarquee;