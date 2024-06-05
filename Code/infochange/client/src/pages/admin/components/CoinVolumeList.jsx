import React from "react";
import CoinVolumeItem from "./CoinVolumeItem";

const CoinVolumeList = ({ coins }) => (
    <div className="col-md-12 col-lg-5 mt-lg-0 mt-4">
        <div className="card shadow-sm h-100" role="region" aria-labelledby="coin-volume-list" tabIndex="0">
            <div className="card-body">
                <h2 id="coin-volume-list" className="card-title h5">Monedas con Mayor Volumen</h2>
                <ul className="list-group list-group-flush">
                    {coins.map((coin, index) => (
                        <CoinVolumeItem key={index} coin={coin} />
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

export default CoinVolumeList;
