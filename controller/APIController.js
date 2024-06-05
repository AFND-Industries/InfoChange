const utils = require("../utils/utils");

const apiController = {};

const Coins = require("../assets/Coins.json");
//const Symbols = require("../assets/Symbols.json");

const tradingComision = 0.00065;

let prices = [];
let coins = [];
let last_update;

const getPrices = () => {
  try {
    fetch("https://api.binance.com/api/v1/ticker/price")
      .then((response) => response.json())
      .then((data) => {
        prices = data;

        utils.applog(
          "Precios actualizados: " + new Date().toLocaleString(),
          "BINANCE"
        );
      });
  } catch (e) {
    utils.applog(e, "ERROR");
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
        utils.applog("Datos de la API actualizados", "RESTAPI");
        last_update = new Date().toLocaleString();
      })
      .catch((error) => {
        throw error;
      });
  } catch (e) {
    utils.applog(e, "ERROR");
  }
};

// tomar los datos de la api inicial
getCoins();

// actualizar cada 2 minutos
setInterval(getCoins, 120000);

apiController.coins = (req, res) => {
  res.json({ coins: coins, last_update: last_update });
  utils.applog(`Petición "/coins" ejecutada`, "REQUEST");
};

apiController.prices = (req, res) => {
  const symbol = req.query.symbol;
  if (symbol !== undefined) {
    const price = prices.find((price) => price.symbol === symbol);
    res.json(price);
    utils.applog(
      `Petición "/prices" del simbolo ` + symbol + ` ejecutada`,
      "REQUEST"
    );
  } else {
    res.json(prices);
    utils.applog(`Petición "/prices" ejecutada`, "REQUEST");
  }
};

module.exports = { apiController, getPrices: () => prices };
