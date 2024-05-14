import React from "react";

export default function AdminPage() {
    // Datos simulados para mostrar en el panel
    const totalUsers = 100;
    const totalTransactions = 500;
    const totalCommission = 2000;
    const topVolumeCoins = ["BTC", "ETH", "XRP"];
    const userData = [
        { id: 1, username: "user1", balance: 1000, coins: { BTC: 5, ETH: 10, XRP: 50 } },
        { id: 2, username: "user2", balance: 500, coins: { BTC: 2, ETH: 20, XRP: 30 } },
        // Otros datos de usuarios...
    ];

    // Función para calcular el balance total en USD de todas las monedas de un usuario
    const calculateTotalBalance = (coins) => {
        let total = 0;
        for (const coin in coins) {
            // Suponiendo que hay un objeto con los precios de las monedas
            const price = 100//coinPrices[coin]; // Obtener el precio de la moneda desde algún objeto
            total += coins[coin] * price;
        }
        return total;
    };

    // Calculando el balance total de todas las monedas de todos los usuarios
    const totalUsersBalance = userData.reduce((acc, user) => acc + calculateTotalBalance(user.coins), 0);

    return (
        <div className="container mt-4 mb-4">
            <div className="row">
                <div className="col-12 text-center mb-4">
                    <h2>Panel de Administración</h2>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Usuarios Registrados</h5>
                            <p className="card-text">{totalUsers}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Transacciones Realizadas</h5>
                            <p className="card-text">{totalTransactions}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Ganancias por Comisiones</h5>
                            <p className="card-text">${totalCommission}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Usuarios con Mayor Balance</h5>
                            <p className="card-text">Total Balance en USD: ${totalUsersBalance}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Monedas con Mayor Volumen</h5>
                            <ul className="list-group list-group-flush">
                                {topVolumeCoins.map((coin, index) => (
                                    <li key={index} className="list-group-item">{coin}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Historial de depositos y retiros</h5>
                            {false && <ul className="list-group list-group-flush">
                                {topVolumeCoins.map((coin, index) => (
                                    <li key={index} className="list-group-item">{coin}</li>
                                ))}
                            </ul>}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Balance total del exchange</h5>
                            <p className="card-text">4 millones de USD</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
