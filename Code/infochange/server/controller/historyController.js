const initModels = require("../models/init-models");
const sequelize = require("sequelize");
const models = initModels(sequelize);
const { Op } = require("sequelize");

const utils = require("../utils/utils");

const historyController = {};

historyController.bizumHistory = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.json(
                utils.error("NOT_LOGGED", "No existe una sesión del usuario.")
            );
        }

        const result = await models.bizum_history.findAll({
            where: {
                [Op.or]: [
                    { sender: req.session.user.ID },
                    { receiver: req.session.user.ID },
                ],
            },
        });

        const bizumHistory = [];
        result.forEach((row) => {
            const bizum = {
                id: row.id,
                sender: row.sender,
                receiver: row.receiver,
                quantity: row.quantity,
                date: row.date,
            };
            bizumHistory.push(bizum);
        });

        res.json({
            status: "1",
            bizumHistory: bizumHistory,
        });
    } catch (e) {
        res.json(utils.error("ERROR", `Ha ocurrido un error inesperado: ${e}`));
    }
};

historyController.tradeHistory = (req, res) => {
    if (!req.session.user) {
        return res.json(
            utils.error("NOT_LOGGED", "No existe una sesión del usuario.")
        );
    }

    const query = `SELECT id, symbol, type, paid_amount, amount_received, comission, date, price FROM trade_history WHERE user = ${req.session.user.ID};`;
    db.query(query, (err, result) => {
        if (err)
            return res.json(
                utils.error(
                    "SELECT_ERROR",
                    "Se ha producido un error inesperado"
                )
            );

        const tradeHistory = [];
        result.forEach((row) => {
            const trade = {
                id: row.id,
                symbol: row.symbol,
                type: row.type,
                paid_amount: row.paid_amount,
                amount_received: row.amount_received,
                comission: row.comission,
                date: row.date,
                price: row.price,
            };
            tradeHistory.push(trade);
        });

        res.json({
            status: "1",
            tradeHistory: tradeHistory,
        });
    });
};

module.exports = historyController;
