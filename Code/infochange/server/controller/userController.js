const initModels = require("../models/init-models");
const sequelize = require("sequelize");
const models = initModels(sequelize);
const { Op } = require("sequelize");
const utils = require("../utils/utils");

const userController = {};

userController.auth = async (req, res) => {
  try {
    if (!req.session.user) {
      res.json({
        status: "0",
      });
    } else {
      const result = await models.user.findOne({
        where: {
          ID: req.session.user.ID,
        },
      });

      res.json({
        status: "1",
        user: result,
      });
    }
  } catch (e) {
    res.json(utils.error("ERROR", `Ha ocurrido un error inesperado: ${e}`));
  }
};

userController.login = async (req, res) => {
  try {
    if (!req.body.user || !req.body.pass) {
      res.json(
        utils.error("MISSING_PARAMETERS", "Debe rellenar todos los campos")
      );
    } else {
      const user = await models.user.findOne({
        where: {
          username: {
            [Op.like]: req.body.user,
          },
          password: {
            [Op.like]: utils.hash(req.body.pass),
          },
        },
      });

      let st = "0";
      if (user) {
        st = "1";
        req.session.user = user;
        utils.applog(
          `Inicio de sesión realizado [${req.body.user}] ${req.ip}`,
          "AUTH"
        );
      }
      res.json({ status: st });
    }
  } catch (e) {
    res.json(utils.error("ERROR", `Ha ocurrido un error inesperado: ${e}`));
  }
};

userController.logout = async (req, res) => {
  req.session.destroy();

  res.json({ status: "1" });

  utils.applog(`Petición "/logout" ejecutada`, "REQUEST");
};

userController.checkEmail = async (req, res) => {
  const email = req.body.email;
  if (!email) {
    res.json(
      utils.error("MISSING_PARAMETERS", "Debe rellenar todos los campos")
    );
    utils.applog(`Register: Malformed Request`, "ERROR");
  } else {
    try {
      const count = await models.user.findAndCountAll({
        where: {
          email: {
            [Op.like]: email,
          },
        },
      });

      if (count > 0) {
        // Si count es mayor que 0, significa que el correo electrónico ya está en uso
        res.json({
          status: "0",
          message: "Correo electrónico ya registrado",
        });
      } else {
        // Si count es 0, el correo electrónico no está en uso
        res.json({
          status: "1",
          message: "Correo electrónico disponible",
        });
      }
    } catch (e) {
      res.json(utils.error("ERROR", `Ha ocurrido un error inesperado: ${e}`));
    }
  }
};

userController.register = async (req, res) => {
  try {
    const user = req.body.user;
    if (
      !user ||
      !user.name ||
      !user.lastName ||
      !user.birthday ||
      !user.sexo ||
      !user.username ||
      !user.email ||
      !user.password ||
      !user.secureQuestionText ||
      !user.direccion ||
      !user.ciudad ||
      !user.codigoPostal ||
      !user.pais ||
      !user.telefono ||
      !user.ID
    ) {
      res.json(
        utils.error("MISSING_PARAMETERS", "Debe rellenar todos los campos")
      );
      utils.applog(`Register: Malformed Request`, "ERROR");
    } else {
      await models.user.create({
        firstName: user.name,
        lastName: user.lastName,
        birthday: user.birthday,
        gender: user.sexo,
        username: user.username,
        email: user.email,
        password: utils.hash(user.password),
        secureQuestionText: user.secureQuestionText,
        // secureQuestion: user.secureQuestion,
        address: user.direccion,
        city: user.ciudad,
        zipCode: user.codigoPostal,
        country: user.pais,
        phone: user.telefono,
        document: user.ID,
        mode: 0,
      });
      utils.applog(`Usuario ${user.username} registrado`, "REQUEST");
      res.json({
        status: 1,
      });
    }
  } catch (e) {
    res.json(utils.error("ERROR", `Ha ocurrido un error inesperado: ${e}`));
  }
};

userController.bizumUsers = async (req, res) => {
  try {
    const result = await models.user.findAll({
      attributes: ["firstName", "lastName", "username", "ID"],
      limit: 10,
    });
    res.json({
      status: "1",
      users: result,
    });
  } catch (e) {
    res.json(utils.error("ERROR", `Ha ocurrido un error inesperado: ${e}`));
  }
};

userController.swap = async (req, res) => {
  if (!req.session.user) {
    res.json(utils.error("UNAUTHORIZED", "No ha iniciado sesión"));
  } else {
    try {
      const user = await models.user.findOne({
        where: {
          ID: req.session.user.ID,
        },
      });

      await user.update({
        mode: (1 + user.mode) % 2,
      });

      res.json({
        status: "1",
        user: user,
      });
    } catch (e) {
      res.json(utils.error("ERROR", `Ha ocurrido un error inesperado: ${e}`));
    }
  }
};

userController.admin = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.firstName !== "admin") {
      res.json(utils.error("UNAUTHORIZED", "No eres administrador"));
    } else {
      const users = await models.user.findAll({
        attributes: ["firstName", "lastName", "username", "ID"],
      });

      const wallets = await models.wallet.findAll({
        attributes: ["user", "coin", "quantity"],
      });

      const paymentHistory = await models.payment_history.findAll({
        attributes: ["id", "user", "quantity", "date", "method", "info"],
      });

      const tradeHistory = await models.trade_history.findAll({
        attributes: [
          "id",
          "user",
          "symbol",
          "type",
          "paid_amount",
          "amount_received",
          "comission",
          "date",
          "price",
        ],
      });

      const bizumHistory = await models.bizum_history.findAll({
        attributes: ["id", "sender", "receiver", "quantity", "date"],
      });

      res.json({
        status: "1",
        info: {
          users: users,
          wallets: wallets,
          trade_history: tradeHistory,
          bizum_history: bizumHistory,
          payment_history: paymentHistory,
        },
      });
    }
  } catch (e) {
    res.json(utils.error("ERROR", `Ha ocurrido un error inesperado: ${e}`));
  }
};

userController.users = async (req, res) => {
  try {
    const users = await models.user.findAll();
    res.json(users);
    utils.applog(`Petición "/users" ejecutada`, "REQUEST");
  } catch (e) {
    res.json(
      utils.error("ERROR", `Ha ocurrido un error inesperado: ${er.sqlMessage}`)
    );
  }
};
module.exports = userController;
