import React, { useState } from "react";

function Header() {
    const [searchInput, setSearchInput] = useState("");

    const searchHandler = () => {
        window.location.href = "./" + searchInput;
    }

    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            searchHandler();
        }
    }

    return (
        <header className="header bg-primary text-white py-3">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <h1 className="m-0">InfoChange</h1>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex">
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Buscar par..."
                                style={{ backgroundColor: "#ffffff", color: "#000000" }}
                                value={searchInput}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                            />
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
