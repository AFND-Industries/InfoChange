import React from "react";

function Footer() {
    return (
        <footer className="mt-auto">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} AFND Industries</p>
            </div>
        </footer>
    )
}

export default Footer;