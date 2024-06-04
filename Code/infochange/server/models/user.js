const Sequelize = require("sequelize");
const db = require("../config/database");

module.exports = function (sequelize, DataTypes) {
    return db.define(
        "user",
        {
            ID: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: true,
                primaryKey: true,
            },
            firstName: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            birthday: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            gender: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            username: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            email: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            password: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            secureQuestionText: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            city: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            zipCode: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            country: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            phone: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            document: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            mode: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            secureQuestion: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "secure_question",
                    key: "ID",
                },
            },
        },
        {
            sequelize,
            tableName: "user",
            timestamps: false,
        }
    );
};
