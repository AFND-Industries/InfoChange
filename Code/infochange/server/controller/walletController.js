const initModels = require("../models/init-models");
const sequelize = require("sequelize");
const models = initModels(sequelize);
const { Op } = require("sequelize");
const Coins = require("../assets/Coins.json");
const Symbols = require("../assets/Symbols.json");
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
      return res.json(utils.error("MISSING_PARAMETERS", "Faltan parámetros."));

    if (isNaN(amount) || amount < 0)
      return res.json(utils.error("INVALID_AMOUNT", "Cantidad inválida."));

    const sentAmount = parseFloat(parseFloat(amount).toFixed(8));

    try {
      const cantidad = await models.wallet.findOne({
        attributes: ["quantity"],
        where: {
          coin: {
            [Op.like]: coin,
          },
          user: req.session.user.ID,
        },
      });
      const currentDollarAmount =
        cantidad.length === 0
          ? -1
          : parseFloat(cantidad[0].quantity.toFixed(8));
      if (currentDollarAmount < sentAmount)
        return res.json(
          utils.error("INSUFFICIENT_BALANCE", `No tienes suficientes ${coin}.`)
        );

      const newBizumerAmount = currentDollarAmount - sentAmount;
      if (newBizumerAmount === 0) {
        const result = await models.wallet.findOne({
          where: {
            coin: coin,
            user: req.session.user.ID,
          },
        });
        await result.destroy();
      } else {
        const result = await models.wallet.findOne({
          where: {
            coin: coin,
            user: req.session.user.ID,
          },
        });
        await result.update({
          quantity: newBizumerAmount.toFixed(8),
        });

        const cantidad = await models.wallet.findOne({
          attributes: ["quantity"],
          where: {
            coin: {
              [Op.like]: coin,
            },
            user: userid,
          },
        });
        if (cantidad.length === 0) {
          // UPDATE wallet SET quantity = quantity + ${sentAmount.toFixed(
          //     8
          //   )} WHERE coin = '${coin}' AND user = ${userid};`
          const result = await models.wallet.findOne({
            where: {
              coin: coin,
              user: userid,
            },
          });
          await result.update({
            quantity: quantity + sentAmount.toFixed(8),
          });
        } else {
          // `INSERT INTO wallet (user, coin, quantity) VALUES (${userid}, '${coin}', ${sentAmount.toFixed(
          //     8
          //   )});`
          await models.wallet.create({
            user: userid,
            coin: coin,
            quantity: sentAmount.toFixed(8),
          });
        }
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        const day = ("0" + currentDate.getDate()).slice(-2);
        const hours = ("0" + currentDate.getHours()).slice(-2);
        const minutes = ("0" + currentDate.getMinutes()).slice(-2);
        const seconds = ("0" + currentDate.getSeconds()).slice(-2);

        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        // `INSERT INTO bizum_history (sender, receiver, quantity, date) VALUES
        await models.bizum_history.create({
          sender: req.session.user.ID,
          receiver: userid,
          quantity: sentAmount.toFixed(2),
          date: formattedDate,
        });

        res.json({
          status: "1",
        });
      }
    } catch (e) {
      res.json(utils.error("ERROR", `Ha ocurrido un error inesperado: ${e}`));
    }
  }
};

walletController.wallet = async (req, res) => {
  if (!req.session.user) {
    res.json(utils.error("UNAUTHORIZED", "No ha iniciado sesión"));
  } else {
    try {
      const result = await models.wallet.findAll({
        attributes: ["coin", "quantity"],
        where: {
          user: req.session.user.ID,
        },
      });
      res.json({
        status: "1",
        wallet: result,
      });
    } catch (e) {
      res.json(utils.error("ERROR", `Ha ocurrido un error inesperado: ${e}`));
    }
  }
};

walletController.trade = async (req, res) => {
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
      utils.error("INVALID_QUANTITY", "La cantidad introducida no es válida.")
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
  try {
    const cantidad = await models.wallet.findOne({
      attributes: ["quantity"],
      where: {
        coin: {
          [Op.like]: removeAsset,
        },
        user: req.session.user.ID,
      },
    });

    const currentAmount =
      cantidad.length === 0 ? -1 : parseFloat(cantidad[0].quantity.toFixed(8));
    if (currentAmount < paidAmount) {
      return res.json(
        utils.error(
          "INSUFFICIENT_BALANCE",
          `No tienes suficientes ${paidAssetName}.`
        )
      );
    }

    const comission = parseFloat((paidAmount * tradingComision).toFixed(8));
    const receivedAmount =
      type === "BUY"
        ? (paidAmount - comission) / symbolPrice
        : (paidAmount - comission) * symbolPrice;

    const updatedAmount = currentAmount - paidAmount;

    if (updatedAmount === 0) {
      const result = await models.wallet.findOne({
        where: {
          coin: removeAsset,
          user: req.session.user.ID,
        },
      });
      await result.destroy();
    } else {
      const result = await models.wallet.findOne({
        where: {
          coin: removeAsset,
          user: req.session.user.ID,
        },
      });
      await result.update({
        quantity: updatedAmount.toFixed(8),
      });

      const cantidad = await models.wallet.findOne({
        attributes: ["quantity"],
        where: {
          coin: {
            [Op.like]: addAsset,
          },
          user: req.session.user.ID,
        },
      });
      const currentQuoteAmount =
        cantidad.length === 0
          ? -1
          : parseFloat(cantidad[0].quantity.toFixed(8));
      if (currentQuoteAmount >= 0) {
        const result = await models.wallet.findOne({
          where: {
            coin: addAsset,
            user: req.session.user.ID,
          },
        });
        await result.update({
          quantity: quantity + receivedAmount.toFixed(8),
        });
      } else {
        await models.wallet.create({
          user: req.session.user.ID,
          coin: addAsset,
          quantity: receivedAmount.toFixed(8),
        });

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Agrega un cero inicial si es necesario
        const day = ("0" + currentDate.getDate()).slice(-2); // Agrega un cero inicial si es necesario
        const hours = ("0" + currentDate.getHours()).slice(-2); // Agrega un cero inicial si es necesario
        const minutes = ("0" + currentDate.getMinutes()).slice(-2); // Agrega un cero inicial si es necesario
        const seconds = ("0" + currentDate.getSeconds()).slice(-2); // Agrega un cero inicial si es necesario

        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        await models.trade_history.create({
          user: req.session.user.ID,
          symbol: symbolPriceObject.symbol,
          type: type,
          paid_amount: paidAmount.toFixed(8),
          amount_received: receivedAmount.toFixed(8),
          comission: comission.toFixed(8),
          date: formattedDate,
          price: symbolPrice,
        });

        res.json({
          status: "1",
          comission: comission,
          paidAmount: paidAmount,
          receivedAmount: receivedAmount,
        });
      }
    }
  } catch (e) {
    res.json(
      utils.error("SELECT_ERROR", "Se ha producido un error inesperado")
    );
  }
};

walletController.payment = async (req, res) => {
  if (!req.session.user) {
    res.json(utils.error("NOT_LOGGED", "No existe una sesión del usuario."));
  } else if (!req.body.cart || !req.body.cart.type || !req.body.cart.quantity) {
    res.json(
      utils.error(
        "MALFORMED_REQUEST",
        "La petición no se ha formulado correctamente"
      )
    );
  } else {
    const cart = req.body.cart;

    const coin = await models.wallet.findAll({
      attributes: ["coin"],
      where: {
        coin: {
          [Op.like]: cart.type,
        },
        user: req.session.user.ID,
      },
    });

    if (coin.length === 0) {
      await models.wallet.create({
        user: req.session.user.ID,
        coin: cart.type,
        quantity: cart.quantity,
      });

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
      const day = ("0" + currentDate.getDate()).slice(-2);
      const hours = ("0" + currentDate.getHours()).slice(-2);
      const minutes = ("0" + currentDate.getMinutes()).slice(-2);
      const seconds = ("0" + currentDate.getSeconds()).slice(-2);

      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      await models.payment_history.create({
        user: req.session.user.ID,
        type: "PAY",
        quantity: cart.quantity,
        date: formattedDate,
        method: req.body.method.type.toUpperCase(),
        info: req.body.method.info,
      });

      res.json({
        status: 1,
        feedback: "OK",
      });
    } else {
      const wallet = await models.wallet.findOne({
        where: {
          coin: {
            [Op.like]: cart.type,
          },
          user: req.session.user.ID,
        },
      });
      wallet.update({
        quantity: quantity + parseFloat(cart.quantity),
      });

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
      const day = ("0" + currentDate.getDate()).slice(-2);
      const hours = ("0" + currentDate.getHours()).slice(-2);
      const minutes = ("0" + currentDate.getMinutes()).slice(-2);
      const seconds = ("0" + currentDate.getSeconds()).slice(-2);

      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      await models.payment_history.create({
        user: req.session.user.ID,
        type: "PAY",
        quantity: cart.quantity,
        date: formattedDate,
        method: req.body.method.type.toUpperCase(),
        info: req.body.method.info,
      });

      res.json({
        status: 1,
        feedback: "OK",
      });
    }
  }
};
module.exports = walletController;
