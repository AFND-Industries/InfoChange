import React from "react";

function UnknownPage() {
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
            <div className="container mt-3 text-center">
                <span className="h1">Unknown Page</span><br /><br />
                <span className="h5">¿Qué quieres que haga Pereira?</span>
            </div>
        </div>
    );
}

export default UnknownPage;