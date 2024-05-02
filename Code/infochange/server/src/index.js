const express = require("express");
const session = require('express-session');
const { createHash } = require('crypto');
const cors = require("cors");
const mysql = require("mysql");

require("dotenv").config();

const app = express();
app.use(session({ secret: 'IEEE754' }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// private function
const applog = (msg, tag = "SERVER") => {
  console.log(`[${new Date().toLocaleString()}] [${tag || "INFO"}] ${msg}`);
};

const hash = (string) => {
  return createHash('sha256').update(string).digest('hex');
}

// hacer funcion error

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

app.get("/auth", (req, res) => {
  res.json({
    status: req.session.user === undefined ? "0" : "1",
    user: req.session.user,
  });
});

app.get("/login", (req, res) => {
  if (!req.query.user || !req.query.pass) {
    res.send('Faltan los parámetros: {user, pass}');
  } else {
    const query = "SELECT * FROM usuario WHERE NOMBRE LIKE '" + req.query.user + "' AND CLAVE LIKE '" + hash(req.query.pass) + "'";
    db.query(query, (err, result) => {
      if (err)
        res.send(err);
      else {
        let st = "0";
        if (result.length > 0) {
          st = "1";
          req.session.user = req.query.user;
        }
        res.json({ status: st });
      }
    });
  }
  applog(`Petición "/login" ejecutada`, "REQUEST");
});


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send("Logout correctamente");
  applog(`Petición "/logout" ejecutada`, "REQUEST");
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
