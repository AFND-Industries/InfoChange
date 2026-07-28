const Sequelize = require("sequelize");
const db = require("../config/database");

module.exports = function (sequelize, DataTypes) {
    return db.define(
        "wallet",
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
                references: {
                    model: "user",
                    key: "ID",
                },
            },
            coin: {
                type: DataTypes.TEXT,
                allowNull: false,
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
        }
    );
};
