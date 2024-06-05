const initModels = require("../models/init-models");
const sequelize = require("sequelize");
const models = initModels(sequelize);
const { Op } = require("sequelize");

const utils = require("../utils/utils");

const historyController = {};

historyController.bizumHistory = async (req, res) => {
  if (!req.session.user) {
    return res.json(
      utils.error("NOT_LOGGED", "No existe una sesión del usuario.")
    );
  }
  try {
    const result = await models.bizum_history.findAll({
      attributes: ["id", "sender", "receiver", "quantity", "date"],
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
        id: row.ID,
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

historyController.tradeHistory = async (req, res) => {
  if (!req.session.user) {
    return res.json(
      utils.error("NOT_LOGGED", "No existe una sesión del usuario.")
    );
  }

  const trade_history = await models.trade_history.findAll({
    attributes: [
      "id",
      "symbol",
      "type",
      "paid_amount",
      "amount_received",
      "comission",
      "date",
      "price",
    ],
    where: {
      user: req.session.user.ID,
    },
  });

  const tradeHistory = [];
  trade_history.forEach((row) => {
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
};

historyController.paymentHistory = async (req, res) => {
  if (!req.session.user) {
    return res.json(error("NOT_LOGGED", "No existe una sesión del usuario."));
  }

  const result = await models.payment_history.findAll({
    attributes: ["id", "type", "quantity", "date", "method", "info"],
    where: {
      user: req.session.user.ID,
    },
  });

  const paymentHistory = [];
  result.forEach((row) => {
    const payment = {
      id: row.id,
      type: row.type,
      quantity: row.quantity,
      date: row.date,
      method: row.method,
      info: row.info,
    };
    paymentHistory.push(payment);
  });

  res.json({
    status: "1",
    paymentHistory: paymentHistory,
  });
};

module.exports = historyController;
