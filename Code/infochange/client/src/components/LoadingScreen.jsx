import React from "react";

import "./LoadingScreen.css"

export default function LoadingScreen() {
    return (
        <div id="loading-screen" style={{ display: "none" }}>
            <div className="loading-screen d-flex justify-content-center align-items-center">
                <div className="spinner-border" style={{ width: "100px", height: "100px" }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );
}