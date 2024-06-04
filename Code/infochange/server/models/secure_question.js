const Sequelize = require("sequelize");
const db = require("../config/database");
module.exports = function (sequelize, DataTypes) {
    return db.define(
        "secure_question",
        {
            Description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            ID: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
        },
        {
            sequelize,
            tableName: "secure_question",
            timestamps: false,
        }
    );
};
