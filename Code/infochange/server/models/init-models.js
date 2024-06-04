var DataTypes = require("sequelize").DataTypes;
var _bizum_history = require("./bizum_history");
var _secure_question = require("./secure_question");
var _trade_history = require("./trade_history");
var _user = require("./user");
var _wallet = require("./wallet");

function initModels(sequelize) {
  var bizum_history = _bizum_history(sequelize, DataTypes);
  var secure_question = _secure_question(sequelize, DataTypes);
  var trade_history = _trade_history(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var wallet = _wallet(sequelize, DataTypes);

  user.belongsTo(secure_question, {
    as: "secureQuestion_secure_question",
    foreignKey: "secureQuestion",
  });
  secure_question.hasMany(user, {
    as: "users",
    foreignKey: "secureQuestion",
  });
  bizum_history.belongsTo(user, {
    as: "receiver_user",
    foreignKey: "receiver",
  });
  user.hasMany(bizum_history, {
    as: "bizum_histories",
    foreignKey: "receiver",
  });
  bizum_history.belongsTo(user, { as: "sender_user", foreignKey: "sender" });
  user.hasMany(bizum_history, {
    as: "sender_bizum_histories",
    foreignKey: "sender",
  });
  wallet.belongsTo(user, { as: "user_user", foreignKey: "user" });
  user.hasMany(wallet, { as: "wallets", foreignKey: "user" });

  return {
    bizum_history,
    secure_question,
    trade_history,
    user,
    wallet,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
