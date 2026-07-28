const Sequelize = require("sequelize");
const db = require("../config/database");
module.exports = function (sequelize, DataTypes) {
    return db.define(
        "payment_history",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
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
            type: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.REAL,
                allowNull: false,
            },
            date: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            info: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            method: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "payment_history",
            timestamps: false,
        }
    );
};
