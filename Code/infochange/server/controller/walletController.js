const initModels = require("../models/init-models");
const sequelize = require("sequelize");
const models = initModels(sequelize);

const db = require("../config/database");

const utils = require("../utils/utils");

const walletController = {};

walletController.bizum = async (req, res) => {
    if (!req.session.user) {
        res.json(utils.error("UNAUTHORIZED", "No ha iniciado sesión"));
    } else {
        const userid = req.body.userid;
        const amount = req.body.amount;
        const coin = "USDT";

        if (!userid || !amount)
            return res.json(
                utils.error("MISSING_PARAMETERS", "Faltan parámetros.")
            );

        if (isNaN(amount) || amount < 0)
            return res.json(
                utils.error("INVALID_AMOUNT", "Cantidad inválida.")
            );

        const sentAmount = parseFloat(parseFloat(amount).toFixed(8));

        /*
        const wallet = await models.wallet.findOne({
            where: {
                coin: coin,
                user: req.session.user.ID,
            },
        });

        const currentDollarAmount = !wallet
            ? -1
            : parseFloat(wallet.quantity.toFixed(8));

        if (currentDollarAmount < sentAmount)
            return res.json(
                utils.error(
                    "INSUFFICIENT_BALANCE",
                    `No tienes suficientes ${coin}.`
                )
            );
        else if (currentDollarAmount === sentAmount) {
            await wallet.destroy();
        } else {

        }
        */

        db.all(
            `SELECT quantity FROM cartera WHERE coin LIKE '${coin}' AND user = ${req.session.user.ID};`,
            (err, result) => {
                if (err)
                    return res.json(
                        utils.error(
                            "SELECT_ERROR",
                            "Se ha producido un error inesperado"
                        )
                    );

                const currentDollarAmount =
                    result.length === 0
                        ? -1
                        : parseFloat(result[0].quantity.toFixed(8));
                if (currentDollarAmount < sentAmount)
                    return res.json(
                        utils.error(
                            "INSUFFICIENT_BALANCE",
                            `No tienes suficientes ${coin}.`
                        )
                    );

                const newBizumerAmount = currentDollarAmount - sentAmount;
                const bizumerQuery =
                    newBizumerAmount === 0
                        ? `DELETE FROM cartera WHERE coin = '${coin}' AND user = ${req.session.user.ID};`
                        : `UPDATE cartera SET quantity = ${newBizumerAmount.toFixed(
                              8
                          )} WHERE coin = '${coin}' AND user = ${
                              req.session.user.ID
                          };`;

                db.all(bizumerQuery, (err, result) => {
                    if (err)
                        return res.json(
                            utils.error(
                                "UPDATE_ERROR",
                                "Se ha producido un error inesperado"
                            )
                        );

                    db.all(
                        `SELECT quantity FROM cartera WHERE user = ${userid} AND coin = '${coin}';`,
                        (err, result) => {
                            if (err)
                                return res.json(
                                    utils.error(
                                        "SELECT_ERROR",
                                        "Se ha producido un error inesperado"
                                    )
                                );

                            const bizumedQuery =
                                result.length > 0
                                    ? `UPDATE cartera SET quantity = quantity + ${sentAmount.toFixed(
                                          8
                                      )} WHERE coin = '${coin}' AND user = ${userid};`
                                    : `INSERT INTO cartera (user, coin, quantity) VALUES (${userid}, '${coin}', ${sentAmount.toFixed(
                                          8
                                      )});`;
                            db.all(bizumedQuery, (err, result) => {
                                if (err)
                                    return res.json(
                                        utils.error(
                                            "UPDATE_ERROR",
                                            "Se ha producido un error inesperado"
                                        )
                                    );

                                const currentDate = new Date();
                                const year = currentDate.getFullYear();
                                const month = (
                                    "0" +
                                    (currentDate.getMonth() + 1)
                                ).slice(-2);
                                const day = ("0" + currentDate.getDate()).slice(
                                    -2
                                );
                                const hours = (
                                    "0" + currentDate.getHours()
                                ).slice(-2);
                                const minutes = (
                                    "0" + currentDate.getMinutes()
                                ).slice(-2);
                                const seconds = (
                                    "0" + currentDate.getSeconds()
                                ).slice(-2);

                                const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                                db.all(
                                    `INSERT INTO bizum_history (sender, receiver, quantity, date) VALUES 
                            (${
                                req.session.user.ID
                            }, ${userid}, ${sentAmount.toFixed(
                                        2
                                    )}, '${formattedDate}')`,
                                    (err, result) => {
                                        if (err)
                                            return res.json(
                                                utils.error(
                                                    "HISTORY_ERROR",
                                                    "Se ha producido un error inesperado"
                                                )
                                            );

                                        return res.json({
                                            status: "1",
                                        });
                                    }
                                );
                            });
                        }
                    );
                });
            }
        );
    }
};

walletController.wallet = (req, res) => {
    if (!req.session.user) {
        res.json(utils.error("UNAUTHORIZED", "No ha iniciado sesión"));
    } else {
        const query = `SELECT coin, quantity FROM cartera WHERE user = ${req.session.user.ID}`;
        db.all(query, (err, result) => {
            if (err) {
                res.json(utils.error(err.code, err.sqlMessage));
            } else {
                res.json({
                    status: 1,
                    wallet: result,
                });
            }
        });
    }
};

walletController.trade = (req, res) => {
    if (!req.session.user) {
        return res.json(
            utils.error("NOT_LOGGED", "No existe una sesión del usuario.")
        );
    }

    const symbol = Object.values(Symbols.symbols).find(
        (s) => s.symbol === req.body.symbol
    );
    const quantity = parseFloat(req.body.quantity);
    const type = req.body.type;

    if (!symbol) {
        return res.json(
            utils.error(
                "INVALID_SYMBOL",
                "No se ha encontrado el símbolo especificado."
            )
        );
    }

    if (isNaN(quantity) || quantity <= 0) {
        return res.json(
            utils.error(
                "INVALID_QUANTITY",
                "La cantidad introducida no es válida."
            )
        );
    }

    const symbolPriceObject = Object.values(prices).find(
        (p) => p.symbol === symbol.symbol
    );
    if (!symbolPriceObject) {
        return res.json(
            utils.error(
                "NO_SERVER_PRICE",
                "El servidor no dispone de los precios actualmente. Inténtalo de nuevo más tarde."
            )
        );
    }

    const symbolPrice = symbolPriceObject.price;
    const paidAmount = parseFloat(quantity.toFixed(8));

    const removeAsset = type === "BUY" ? symbol.quoteAsset : symbol.baseAsset;
    const addAsset = type === "BUY" ? symbol.baseAsset : symbol.quoteAsset;

    const paidAssetName =
        type === "BUY" ? symbol.quoteAssetName : symbol.baseAssetName;

    db.all(
        `SELECT quantity FROM cartera WHERE coin LIKE '${removeAsset}' AND user = ${req.session.user.ID};`,
        (err, result) => {
            if (err)
                return res.json(
                    utils.error(
                        "SELECT_ERROR",
                        "Se ha producido un error inesperado"
                    )
                );

            const currentAmount =
                result.length === 0
                    ? -1
                    : parseFloat(result[0].quantity.toFixed(8));
            if (currentAmount < paidAmount) {
                return res.json(
                    utils.error(
                        "INSUFFICIENT_BALANCE",
                        `No tienes suficientes ${paidAssetName}.`
                    )
                );
            }

            const comission = parseFloat(
                (paidAmount * tradingComision).toFixed(8)
            );
            const receivedAmount =
                type === "BUY"
                    ? (paidAmount - comission) / symbolPrice
                    : (paidAmount - comission) * symbolPrice;

            const updatedAmount = currentAmount - paidAmount;
            const updateQuery =
                updatedAmount === 0
                    ? `DELETE FROM cartera WHERE coin = '${removeAsset}' AND user = ${req.session.user.ID};`
                    : `UPDATE cartera SET quantity = ${updatedAmount.toFixed(
                          8
                      )} WHERE coin = '${removeAsset}' AND user = ${
                          req.session.user.ID
                      };`;

            db.all(updateQuery, (err, _) => {
                if (err)
                    return res.json(
                        utils.error(
                            "UPDATE_ERROR",
                            "Se ha producido un error inesperado"
                        )
                    );

                db.all(
                    `SELECT quantity FROM cartera WHERE coin = '${addAsset}' AND user = ${req.session.user.ID};`,
                    (err, result) => {
                        if (err)
                            return res.json(
                                utils.error(
                                    "SELECT_ERROR",
                                    "Se ha producido un error inesperado"
                                )
                            );

                        const currentQuoteAmount =
                            result.length === 0
                                ? -1
                                : parseFloat(result[0].quantity.toFixed(8));
                        const query =
                            currentQuoteAmount >= 0
                                ? `UPDATE cartera SET quantity = quantity + ${receivedAmount.toFixed(
                                      8
                                  )} WHERE coin = '${addAsset}' AND user = ${
                                      req.session.user.ID
                                  };`
                                : `INSERT INTO cartera (user, coin, quantity) VALUES (${
                                      req.session.user.ID
                                  }, '${addAsset}', ${receivedAmount.toFixed(
                                      8
                                  )});`;

                        db.all(query, (err, _) => {
                            if (err)
                                return res.json(
                                    utils.error(
                                        "UPDATE_ERROR",
                                        "Se ha producido un error inesperado"
                                    )
                                );

                            const currentDate = new Date();
                            const year = currentDate.getFullYear();
                            const month = (
                                "0" +
                                (currentDate.getMonth() + 1)
                            ).slice(-2); // Agrega un cero inicial si es necesario
                            const day = ("0" + currentDate.getDate()).slice(-2); // Agrega un cero inicial si es necesario
                            const hours = ("0" + currentDate.getHours()).slice(
                                -2
                            ); // Agrega un cero inicial si es necesario
                            const minutes = (
                                "0" + currentDate.getMinutes()
                            ).slice(-2); // Agrega un cero inicial si es necesario
                            const seconds = (
                                "0" + currentDate.getSeconds()
                            ).slice(-2); // Agrega un cero inicial si es necesario

                            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                            const historyQuery = `INSERT INTO trade_history (user, symbol, type, paid_amount, amount_received, comission, date, price) VALUES 
                                    (${req.session.user.ID}, '${
                                symbolPriceObject.symbol
                            }', '${type}', ${paidAmount.toFixed(
                                8
                            )}, ${receivedAmount.toFixed(
                                8
                            )}, ${comission.toFixed(
                                8
                            )}, '${formattedDate}', ${symbolPrice});`;

                            db.all(historyQuery, (err, _) => {
                                if (err)
                                    return res.json(
                                        utils.error(
                                            "HISTORY_ERROR",
                                            "Se ha producido un error inesperado"
                                        )
                                    );
                            });

                            return res.json({
                                status: "1",
                                comission: comission,
                                paidAmount: paidAmount,
                                receivedAmount: receivedAmount,
                            });
                        });
                    }
                );
            });
        }
    );
};

walletController.payment = (req, res) => {
    if (!req.session.user) {
        res.json(
            utils.error("NOT_LOGGED", "No existe una sesión del usuario.")
        );
    } else if (
        !req.body.cart ||
        !req.body.cart.type ||
        !req.body.cart.quantity
    ) {
        res.json(
            utils.error(
                "MALFORMED_REQUEST",
                "La petición no se ha formulado correctamente"
            )
        );
    } else {
        const cart = req.body.cart;
        db.all(
            `SELECT coin FROM cartera where coin like '${cart.type}' and user = ${req.session.user.ID}`,
            (err, result) => {
                if (err) {
                    res.json(
                        utils.error(
                            "SELECT_ERROR",
                            "Se ha producido un error inesperado"
                        )
                    );
                } else if (result.length === 0) {
                    db.all(
                        `INSERT INTO cartera (user, coin, quantity) VALUES (${req.session.user.ID}, '${cart.type}', ${cart.quantity})`,
                        (err, _) => {
                            if (err) {
                                res.json(
                                    utils.error(
                                        "INSERT_ERROR",
                                        "Se ha producido un error inesperado"
                                    )
                                );
                            }
                            res.json({
                                status: 1,
                                feedback: "OK",
                            });
                        }
                    );
                } else {
                    db.all(
                        `UPDATE cartera SET quantity = quantity + ${cart.quantity} WHERE user = ${req.session.user.ID} and coin like '${cart.type}'`,
                        (err, _) => {
                            if (err) {
                                res.json(
                                    utils.error(
                                        "UPDATE_ERROR",
                                        "Se ha producido un error inesperado"
                                    )
                                );
                            }
                            res.json({
                                status: 1,
                                feedback: "OK",
                            });
                        }
                    );
                }
            }
        );
    }
};
module.exports = walletController;
