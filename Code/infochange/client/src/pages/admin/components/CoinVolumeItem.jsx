import React from "react";

const CoinVolumeItem = ({ coin }) => {
    return (
        <li className="list-group-item ps-0 pe-0 py-2 m-0">
            <div className="row d-flex align-items-center justify-content-center">
                <div className="col-sm-5 d-flex align-items-center h5 mb-0">
                    <img src={coin.logo} alt={"Logo de " + coin.name} className="me-2 rounded-4"
                        style={{ width: "50px", height: "50px" }} onError={(e) => { e.target.src = "./favicon.ico"; }} />
                    <div className="fw-bold m-0 me-2">{coin.name}: </div>
                </div>
                <div className="col-sm-7 d-flex align-items-center justify-content-sm-end justify-content-start">
                    <span className="h5 m-0 text-end">{coin.volume.toFixed(8)} {coin.symbol}</span>
                    <span className="h6 text-secondary m-0"> ~{coin.dolar_volume.toFixed(2)}$</span>
                </div>
            </div>
        </li>
    );
}

export default CoinVolumeItem