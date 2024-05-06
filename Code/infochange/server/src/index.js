const express = require("express");
const session = require("express-session");
const { createHash } = require("crypto");
const cors = require("cors");
const mysql = require("mysql");
const Symbols = require("./Coins.json");
const { clear } = require("console");

let coins = [];

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "IEEE754" }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const getCoins = () => {
  const url = "https://api.binance.com/api/v3/ticker/24hr";
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const filteredSymbols = data.filter((symbol) => {
        if (symbol.symbol.endsWith("USDT")) {
          const symbolWithoutUsdt = symbol.symbol.slice(0, -4);

          if (Symbols.allCoins.includes(symbolWithoutUsdt)) {
            return true;
          }
        }

        return false;
      });

      coins = filteredSymbols;
      applog("Datos de la API actualizados", "RESTAPI");
    })
    .catch((error) => {
      throw error;
    });
};

// tomar los datos de la api inicial
getCoins();

// actualizar cada 2 minutos
setInterval(getCoins, 120000);

const fs = require("fs");

const logFilePath = "././server_log/server.log";

const applog = (msg, tag = "SERVER") => {
  const logMessage = `[${new Date().toLocaleString()}] [${tag}] ${msg}`;
  console.log(logMessage);
  /*fs.appendFile(logFilePath, logMessage + '\n', (err) => {
    if (err) {
      console.error("Error al escribir en el archivo de registro:", err);
    }
  });*/
};

const hash = (string) => createHash("sha256").update(string).digest("hex");

const error = (type, cause) => {
  return {
    status: "-1",
    error: type,
    cause: cause,
  };
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
  // Don't remove for checking connectivity
  res.json({ message: "Hello InfoWorld!" });
});

app.get("/auth", (req, res) => {
  res.json({
    status: req.session.user === undefined ? "0" : "1",
    user: req.session.user,
  });
});

app.post("/login", (req, res) => {
  if (!req.body.user || !req.body.pass) {
    res.json(error("MISSING_PARAMETERS", "Debe rellenar todos los campos"));
  } else {
    const query =
      "SELECT * FROM usuario WHERE Nombre LIKE '" +
      req.body.user +
      "' AND Clave LIKE '" +
      hash(req.body.pass) +
      "'";
    db.query(query, (err, result) => {
      if (err) {
        res.json(error(err.code, err.sqlMessage));
        applog(`Inicio de sesión fallido : ${req.ip}`, "AUTH");
      } else {
        let st = "0";
        if (result.length > 0) {
          st = "1";
          req.session.user = req.body.user;
          applog(
            `Inicio de sesión realizado [${req.body.user}] ${req.ip}`,
            "AUTH"
          );
        }
        res.json({ status: st });
      }
    });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();

  res.json({ status: "1" });

  applog(`Petición "/logout" ejecutada`, "REQUEST");
});

app.post("/register", (req, res) => {
  const user = req.body;
  if (
    !user.username ||
    !user.password ||
    !user.name ||
    !user.lastname ||
    !user.email ||
    !user.phone ||
    !user.document ||
    !user.address ||
    !user.postalcode ||
    !user.country
  ) {
    res.json(error("MISSING_PARAMETERS", "Debe rellenar todos los campos"));
  } else {
    const query = `INSERT INTO usuario (Nombre, Clave, NombreCompleto, Apellidos, Correo, Telefono, Documento, Direccion, CodigoPostal, Pais) VALUES ('${
      user.username
    }', '${hash(user.password)}', '${user.name}', '${user.lastname}', '${
      user.email
    }', '${user.phone}', '${user.document}', '${user.address}', '${
      user.postalcode
    }', '${user.country}')`;
    db.query(query, (err, result) => {
      if (err) {
        res.json(error(err.code, err.sqlMessage));
        applog(`Registro fallido : ${req.ip}`, "AUTH");
      } else {
        res.json({ status: "1" });
        applog(`Registro exitoso : ${req.ip}`, "AUTH");
      }
    });
    applog(`Usuario ${user.username} registrado`, "REQUEST");
    req.session.user = user;
    res.json({
      status: "1",
      user: user,
    });
  }
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM usuario", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
  applog(`Petición "/users" ejecutada`, "REQUEST");
});

app.get("/coins", (req, res) => {
  res.json(coins);
  applog(`Petición "/coins" ejecutada`, "REQUEST");
});

app.listen(port, () => {
  console.clear();
  console.log(
    `
  ┌─────────────────────────────────────────────────────────────┐
  │                                                             │
  │  ___        __       ____             _                  _  │
  │ |_ _|_ __  / _| ___ | __ )  __ _  ___| | _____ _ __   __| | │
  │  | || '_ \\| |_ / _ \\|  _ \\ / _\` |/ __| |/ / _ \\ '_ \\ / _\` | │
  │  | || | | |  _| (_) | |_) | (_| | (__|   <  __/ | | | (_| | │
  │ |___|_| |_|_|  \\___/|____/ \\__,_|\\___|_|\\_\\___|_| |_|\\__,_| │
  │                                                             │
  │                                         by AFND Industries  │
  └─────────────────────────────────────────────────────────────┘

    `
  );
  applog(`Servidor activo en el puerto ${port}`);
});
