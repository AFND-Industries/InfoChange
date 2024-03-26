import React, { useState } from "react";

function Header() {
    const [searchInput, setSearchInput] = useState("");

    const searchHandler = () => {
        window.location.href = "./" + searchInput;
    }

    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
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
                                value={searchInput} // Asigna el valor del input al estado
                                onChange={handleInputChange} // Maneja el cambio en el input
                            />
                            <button
                                onClick={searchHandler}
                                className="btn btn-outline-light"
                                type="button" // Cambia el tipo a "button" para evitar enviar el formulario
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
