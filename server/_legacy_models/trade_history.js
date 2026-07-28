const Sequelize = require("sequelize");
const db = require("../config/database");

module.exports = function (sequelize, DataTypes) {
    return db.define(
        "trade_history",
        {
            ID: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: true,
                primaryKey: true,
            },
            user: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            symbol: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            type: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            paid_amount: {
                type: DataTypes.REAL,
                allowNull: false,
            },
            amount_received: {
                type: DataTypes.REAL,
                allowNull: false,
            },
            comission: {
                type: DataTypes.REAL,
                allowNull: false,
            },
            date: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            price: {
                type: DataTypes.REAL,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "trade_history",
            timestamps: false,
        }
    );
};
