const Sequelize = require("sequelize");
const db = require("../config/database");
module.exports = function (sequelize, DataTypes) {
    return db.define(
        "bizum_history",
        {
            ID: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: true,
                primaryKey: true,
            },
            sender: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "user",
                    key: "ID",
                },
            },
            receiver: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "user",
                    key: "ID",
                },
            },
            quantity: {
                type: DataTypes.REAL,
                allowNull: false,
            },
            date: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "bizum_history",
            timestamps: false,
        }
    );
};
