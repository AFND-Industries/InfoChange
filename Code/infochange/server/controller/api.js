let prices = [];
let coins = [];
let last_update;

const applog = require("../utils/utils").applog;

const getPrices = () => {
    try {
        fetch("https://api.binance.com/api/v1/ticker/price")
            .then((response) => response.json())
            .then((data) => {
                prices = data;

                applog(
                    "Precios actualizados: " + new Date().toLocaleString(),
                    "BINANCE"
                );
            });
    } catch (e) {
        applog(e, "ERROR");
    }
};

getPrices();
setInterval(getPrices, 10000);

const getCoins = () => {
    try {
        const url = "https://api.binance.com/api/v3/ticker/24hr";
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                const filteredCoins = data.filter((symbol) => {
                    if (symbol.symbol.endsWith("USDT")) {
                        const symbolWithoutUsdt = symbol.symbol.slice(0, -4);

                        if (Coins.allCoins.includes(symbolWithoutUsdt)) {
                            return true;
                        }
                    }

                    return false;
                });

                coins = filteredCoins;
                applog("Datos de la API actualizados", "RESTAPI");
                last_update = new Date().toLocaleString();
            })
            .catch((error) => {
                throw error;
            });
    } catch (e) {
        applog(e, "ERROR");
    }
};

// tomar los datos de la api inicial
getCoins();

// actualizar cada 2 minutos
setInterval(getCoins, 120000);

const controller = {};

controller.hello = (req, res) => {
    res.json({ message: "Hello InfoWorld!" });
};

controller.getCoins = (req, res) => {
    res.json({ coins: coins, last_update: last_update });
    applog(`Petición "/coins" ejecutada`, "REQUEST");
};

controller.getPrices = (req, res) => {
    const symbol = req.query.symbol;
    if (symbol !== undefined) {
        const price = prices.find((price) => price.symbol === symbol);
        res.json(price);
        applog(
            `Petición "/prices" del simbolo ` + symbol + ` ejecutada`,
            "REQUEST"
        );
    } else {
        res.json(prices);
        applog(`Petición "/prices" ejecutada`, "REQUEST");
    }
};

module.exports = controller;
