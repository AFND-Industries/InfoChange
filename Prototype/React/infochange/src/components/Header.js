import React, { useState } from "react";
import { useAsset } from "../contexts/AssetContext";
import SymbolItem from "./SymbolItem";

function Header() {
    const [searchInput, setSearchInput] = useState("");
    const [pairs, setPairs] = useState([]);
    const { filterPairs } = useAsset();

    const searchHandler = () => {
        window.location.href = "./" + searchInput;
    }

    const handleInputChange = (event) => {
        if (event.target.value.length === 0) setPairs([]);
        else setPairs(filterPairs(event.target.value));

        setSearchInput(event.target.value);
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            searchHandler();
        }
    }

    // console.log("reloading");
    let pairsObject = pairs.map(p => (
        <SymbolItem pair={p} regex={searchInput} />
    ));

    return (
        <header className="header bg-primary text-white py-3">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <h1 className="m-0">InfoChange</h1>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex">
                            <div className="dropdown w-100 me-2">
                                <input
                                    className="form-control"
                                    type="search"
                                    placeholder="Buscar par..."
                                    style={{ backgroundColor: "#ffffff", color: "#000000" }}
                                    value={searchInput}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                />
                                {pairsObject.length > 0 && <div className="dropdown-menu show" aria-labelledby="dropdownMenuButton">
                                    {pairsObject}
                                </div>}
                            </div>
                            <button
                                onClick={searchHandler}
                                className="btn btn-outline-light"
                                type="button"
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
