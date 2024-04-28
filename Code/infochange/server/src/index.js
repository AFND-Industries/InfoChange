const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
require("dotenv").config();
const app = express();
app.use(cors());

// private function
const applog = (msg, tag) => {
  console.log(`[${new Date().toLocaleString()}] [${tag || "INFO"}] ${msg}`);
};

const port = 1024;

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) throw err;
  applog("Conexión a la base de datos completada", "DATABASE");
});

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/auth", cors(), (req, res) => {
  res.json({ status: "1" });
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM usuario", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
  applog(`Petición "/users" ejecutada`, "REQUEST");
});

app.listen(port, () => {
  applog(`Servidor activo en el puerto ${port}`, "SERVER");
});
