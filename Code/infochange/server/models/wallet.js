const Sequelize = require("sequelize");
const db = require("../config/database");
module.exports = function (sequelize, DataTypes) {
  return db.define(
    "wallet",
    {
      user: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "user",
          key: "ID",
        },
        unique: true,
      },
      coin: {
        type: DataTypes.TEXT,
        allowNull: true,
        primaryKey: true,
        unique: true,
      },
      quantity: {
        type: DataTypes.REAL,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "wallet",
      timestamps: false,
      indexes: [
        {
          name: "sqlite_autoindex_wallet_1",
          unique: true,
          fields: [{ name: "user" }, { name: "coin" }],
        },
      ],
    }
  );
};
