import React, { useState } from 'react';

function AssetBalance({ asset, balance, inputPlaceholder, buttonText, onButtonClick }) {
    const [inputValue, setInput] = useState("");

    const changeHandler = (e) => {
        setInput(e.target.value);
    };

    const handleButtonClick = () => {
        onButtonClick(inputValue);
        setInput("");
    };

    return (
        <div className="col-md-6">
            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">Saldo en {asset}</h5>
                    <p className="card-text">{balance}</p>
                    <div className="input-group mb-3">
                        <input onChange={changeHandler} value={inputValue} type="text" className="form-control" placeholder={inputPlaceholder} />
                        <button className="btn btn-primary" type="button" onClick={handleButtonClick}>{buttonText}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AssetBalance;
