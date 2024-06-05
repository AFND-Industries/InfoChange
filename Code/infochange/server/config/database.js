//require("dotenv").config();

var Sequelize = require("sequelize");
var SQLite = require("sqlite3");

const db = new Sequelize("database", "username", "password", {
  dialect: "sqlite",
  storage: "../infochange.db", // or ':memory:'
  logging: false,
  dialectOptions: {
    // Your sqlite3 options here
    // for instance, this is how you can configure the database opening mode:
    mode: SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE | SQLite.OPEN_FULLMUTEX,
  },
});

module.exports = db;
