const express = require("express");
const session = require("express-session");
const { createHash } = require("crypto");
const cors = require("cors");
const mysql = require("mysql");
const Coins = require("../assets/Coins.json");
const Symbols = require("../assets/Symbols.json");

const tradingComision = 0.00065;

let prices = [];
let coins = [];
let last_update;

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

const getPrices = () => {
  try {
    fetch("https://api.binance.com/api/v1/ticker/price")
      .then((response) => response.json())
      .then((data) => {
        prices = data;

        applog(
          "Precios actualizados: " + new Date().toLocaleString(),
          "BINANCE"
        );
      });
  } catch (e) {
    applog(e, "ERROR");
  }
};

getPrices();
setInterval(getPrices, 10000);

const getCoins = () => {
  try {
    const url = "https://api.binance.com/api/v3/ticker/24hr";
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const filteredCoins = data.filter((symbol) => {
          if (symbol.symbol.endsWith("USDT")) {
            const symbolWithoutUsdt = symbol.symbol.slice(0, -4);

            if (Coins.allCoins.includes(symbolWithoutUsdt)) {
              return true;
            }
          }

          return false;
        });

        coins = filteredCoins;
        applog("Datos de la API actualizados", "RESTAPI");
        last_update = new Date().toLocaleString();
      })
      .catch((error) => {
        throw error;
      });
  } catch (e) {
    applog(e, "ERROR");
  }
};

// tomar los datos de la api inicial
getCoins();

// actualizar cada 2 minutos
setInterval(getCoins, 120000);

const fs = require("fs");

const logFilePath = "././server_log/server.log";

const applog = (msg, tag = "SERVER") => {
  const logMessage = `[${new Date().toLocaleString()}] [${tag}] ${msg}`;
  if (tag === "ERROR") console.error(logMessage);
  else console.log(logMessage);
  /*
        // commented to future
        fs.appendFile(logFilePath, logMessage + "\n", (err) => {
            if (err) {
                console.error("Error al escribir en el archivo de registro:", err);
            }
        });
        */
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
  if (!req.session.user) {
    res.json({
      status: "0",
    });
  } else {
    db.query(
      `SELECT * FROM usuario WHERE ID = ${req.session.user.ID}`,
      (err, result) => {
        if (err) {
          res.json(error("SELECT_ERROR", err.sqlMessage));
        } else {
          res.json({
            status: "1",
            user: result[0],
          });
        }
      }
    );
  }
});

app.post("/login", (req, res) => {
  if (!req.body.user || !req.body.pass) {
    res.json(error("MISSING_PARAMETERS", "Debe rellenar todos los campos"));
  } else {
    const query =
      "SELECT * FROM usuario WHERE username LIKE '" +
      req.body.user +
      "' AND password LIKE '" +
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
          req.session.user = result[0];
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

app.post("/checkemail", (req, res) => {
  const email = req.body.email;
  if (!email) {
    res.json(error("MISSING_PARAMETERS", "Debe rellenar todos los campos"));
    applog(`Register: Malformed Request`, "ERROR");
  } else {
    const query = `SELECT COUNT(*) as count FROM usuario WHERE upper(email) = upper('${email}');`;
    db.query(query, (err, result) => {
      if (err) {
        res.json(error(err.code, err.sqlMessage));
        applog(`Sentencia fallida : ${req.ip}`, "AUTH");
      } else {
        const count = result[0].count;
        if (count > 0) {
          // Si count es mayor que 0, significa que el correo electrónico ya está en uso
          res.json({
            status: "0",
            message: "Correo electrónico ya registrado",
          });
        } else {
          // Si count es 0, el correo electrónico no está en uso
          res.json({
            status: "1",
            message: "Correo electrónico disponible",
          });
        }
      }
    });
  }
});

app.post("/register", (req, res) => {
  const user = req.body.user;
  if (
    !user ||
    !user.name ||
    !user.lastName ||
    !user.birthday ||
    !user.sexo ||
    !user.username ||
    !user.email ||
    !user.password ||
    !user.secureQuestionText ||
    !user.direccion ||
    !user.ciudad ||
    !user.codigoPostal ||
    !user.pais ||
    !user.telefono ||
    !user.ID
  ) {
    res.json(error("MISSING_PARAMETERS", "Debe rellenar todos los campos"));
    applog(`Register: Malformed Request`, "ERROR");
  } else {
    const query = `
    INSERT INTO usuario (
        name,
        lastName,
        birthday,
        sexo,
        username,
        email,
        password,
        secureQuestionText,
        address,
        ciudad,
        postalCode,
        country,
        phone,
        document
    ) VALUES (
        '${user.name}',
        '${user.lastName}',
        '${user.birthday}',
        '${user.sexo}',
        '${user.username}',
        '${user.email}',
        '${hash(user.password)}',
        '${user.secureQuestionText}',
        '${user.direccion}',
        '${user.ciudad}',
        '${user.codigoPostal}',
        '${user.pais}',
        '${user.telefono}',
        '${user.ID}'
    );
`;
    db.query(query, (err, result) => {
      if (err) {
        res.json(error(err.code, err.sqlMessage));
        applog(`Registro fallido : ${req.ip}`, "AUTH");
      } else {
        applog(`Usuario ${user.username} registrado`, "REQUEST");
      }
    });
  }
});

app.get("/bizum_history", (req, res) => {
  if (!req.session.user) {
    return res.json(error("NOT_LOGGED", "No existe una sesión del usuario."));
  }

  const query = `SELECT id, sender, receiver, quantity, date FROM bizum_history WHERE sender = ${req.session.user.ID} OR receiver = ${req.session.user.ID};`;
  db.query(query, (err, result) => {
    if (err)
      return res.json(
        error("SELECT_ERROR", "Se ha producido un error inesperado")
      );

    const bizumHistory = [];
    result.forEach((row) => {
      const bizum = {
        id: row.id,
        sender: row.sender,
        receiver: row.receiver,
        quantity: row.quantity,
        date: row.date,
      };
      bizumHistory.push(bizum);
    });

    res.json({
      status: "1",
      bizumHistory: bizumHistory,
    });
  });
});

app.post("/bizum", (req, res) => {
  if (!req.session.user) {
    res.json(error("UNAUTHORIZED", "No ha iniciado sesión"));
  } else {
    const userid = req.body.userid;
    const amount = req.body.amount;
    const coin = "USDT";

    if (!userid || !amount)
      return res.json(error("MISSING_PARAMETERS", "Faltan parámetros."));

    if (isNaN(amount) || amount < 0)
      return res.json(error("INVALID_AMOUNT", "Cantidad inválida."));

    const sentAmount = parseFloat(parseFloat(amount).toFixed(8));
    db.query(
      `SELECT quantity FROM cartera WHERE coin LIKE '${coin}' AND user = ${req.session.user.ID};`,
      (err, result) => {
        if (err)
          return res.json(
            error("SELECT_ERROR", "Se ha producido un error inesperado")
          );

        const currentDollarAmount =
          result.length === 0 ? -1 : parseFloat(result[0].quantity.toFixed(8));
        if (currentDollarAmount < sentAmount)
          return res.json(
            error("INSUFFICIENT_BALANCE", `No tienes suficientes ${coin}.`)
          );

        const newBizumerAmount = currentDollarAmount - sentAmount;
        const bizumerQuery =
          newBizumerAmount === 0
            ? `DELETE FROM cartera WHERE coin = '${coin}' AND user = ${req.session.user.ID};`
            : `UPDATE cartera SET quantity = ${newBizumerAmount.toFixed(
                8
              )} WHERE coin = '${coin}' AND user = ${req.session.user.ID};`;

        db.query(bizumerQuery, (err, result) => {
          if (err)
            return res.json(
              error("UPDATE_ERROR", "Se ha producido un error inesperado")
            );

          db.query(
            `SELECT quantity FROM cartera WHERE user = ${userid} AND coin = '${coin}';`,
            (err, result) => {
              if (err)
                return res.json(
                  error("SELECT_ERROR", "Se ha producido un error inesperado")
                );

              const bizumedQuery =
                result.length > 0
                  ? `UPDATE cartera SET quantity = quantity + ${sentAmount.toFixed(
                      8
                    )} WHERE coin = '${coin}' AND user = ${userid};`
                  : `INSERT INTO cartera (user, coin, quantity) VALUES (${userid}, '${coin}', ${sentAmount.toFixed(
                      8
                    )});`;
              db.query(bizumedQuery, (err, result) => {
                if (err)
                  return res.json(
                    error("UPDATE_ERROR", "Se ha producido un error inesperado")
                  );

                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
                const day = ("0" + currentDate.getDate()).slice(-2);
                const hours = ("0" + currentDate.getHours()).slice(-2);
                const minutes = ("0" + currentDate.getMinutes()).slice(-2);
                const seconds = ("0" + currentDate.getSeconds()).slice(-2);

                const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                db.query(
                  `INSERT INTO bizum_history (sender, receiver, quantity, date) VALUES 
                            (${
                              req.session.user.ID
                            }, ${userid}, ${sentAmount.toFixed(
                    2
                  )}, '${formattedDate}')`,
                  (err, result) => {
                    if (err)
                      return res.json(
                        error(
                          "HISTORY_ERROR",
                          "Se ha producido un error inesperado"
                        )
                      );

                    return res.json({
                      status: "1",
                    });
                  }
                );
              });
            }
          );
        });
      }
    );
  }
});

app.get("/bizum_users", (req, res) => {
  db.query(
    "SELECT name, lastName, username, id FROM usuario ORDER BY username LIMIT 10;",
    (err, result) => {
      if (err) {
        res.json(error(err.code, err.sqlMessage));
      } else {
        res.json({
          status: "1",
          users: result,
        });
      }
    }
  );
});

app.post("/swap_mode", (req, res) => {
  if (!req.session.user) {
    res.json(error("UNAUTHORIZED", "No ha iniciado sesión"));
  } else {
    db.query(
      `UPDATE usuario SET mode = (mode + 1) % 2 WHERE ID = ${req.session.user.ID};`,
      (err, result) => {
        if (err) {
          res.json(error(err.code, err.sqlMessage));
        } else {
          res.json({
            status: "1",
          });
        }
      }
    );
  }
});

app.get("/admin", (req, res) => {
  if (!req.session.user || req.session.user.name !== "admin") {
    res.json(error("UNAUTHORIZED", "No eres administrador"));
  } else {
    let usersPromise = new Promise((resolve, reject) => {
      db.query(
        "SELECT name, lastName, username, id FROM usuario;",
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    let walletsPromise = new Promise((resolve, reject) => {
      db.query("SELECT user, coin, quantity FROM cartera;", (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    let paymentHistoryPromise = new Promise((resolve, reject) => {
      db.query(
        "SELECT id, user, type, quantity, date, method, info FROM payment_history;",
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    let tradeHistoryPromise = new Promise((resolve, reject) => {
      db.query(
        "SELECT id, user, symbol, type, paid_amount, amount_received, comission, date, price FROM trade_history;",
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    let bizumHistoryPromise = new Promise((resolve, reject) => {
      db.query(
        "SELECT id, sender, receiver, quantity, date FROM bizum_history;",
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    Promise.all([
      usersPromise,
      walletsPromise,
      tradeHistoryPromise,
      paymentHistoryPromise,
      bizumHistoryPromise,
    ])
      .then(([users, wallets, tradeHistory, paymentHistory, bizumHistory]) => {
        res.json({
          status: "1",
          info: {
            users: users,
            wallets: wallets,
            trade_history: tradeHistory,
            bizum_history: bizumHistory,
            payment_history: paymentHistory,
          },
        });
      })
      .catch((er) => {
        res.json(error(er.code, er.sqlMessage)); // Manejar errores de consulta
      });
  }
});

app.get("/wallet", (req, res) => {
  if (!req.session.user) {
    res.json(error("UNAUTHORIZED", "No ha iniciado sesión"));
  } else {
    const query = `SELECT coin, quantity FROM cartera WHERE user = ${req.session.user.ID}`;
    db.query(query, (err, result) => {
      if (err) {
        res.json(error(err.code, err.sqlMessage));
      } else {
        res.json({
          status: 1,
          wallet: result,
        });
      }
    });
  }
});

app.get("/payment_history", (req, res) => {
  if (!req.session.user) {
    return res.json(error("NOT_LOGGED", "No existe una sesión del usuario."));
  }

  const query = `SELECT id, type, quantity, date, method, info FROM payment_history WHERE user = ${req.session.user.ID};`;
  db.query(query, (err, result) => {
    if (err)
      return res.json(
        error("SELECT_ERROR", "Se ha producido un error inesperado")
      );

    const paymentHistory = [];
    result.forEach((row) => {
      const payment = {
        id: row.id,
        type: row.type,
        quantity: row.quantity,
        date: row.date,
        method: row.method,
        info: row.info,
      };
      paymentHistory.push(payment);
    });

    res.json({
      status: "1",
      paymentHistory: paymentHistory,
    });
  });
});

app.get("/trade_history", (req, res) => {
  if (!req.session.user) {
    return res.json(error("NOT_LOGGED", "No existe una sesión del usuario."));
  }

  const query = `SELECT id, symbol, type, paid_amount, amount_received, comission, date, price FROM trade_history WHERE user = ${req.session.user.ID};`;
  db.query(query, (err, result) => {
    if (err)
      return res.json(
        error("SELECT_ERROR", "Se ha producido un error inesperado")
      );

    const tradeHistory = [];
    result.forEach((row) => {
      const trade = {
        id: row.id,
        symbol: row.symbol,
        type: row.type,
        paid_amount: row.paid_amount,
        amount_received: row.amount_received,
        comission: row.comission,
        date: row.date,
        price: row.price,
      };
      tradeHistory.push(trade);
    });

    res.json({
      status: "1",
      tradeHistory: tradeHistory,
    });
  });
});

app.post("/trade", (req, res) => {
  if (!req.session.user) {
    return res.json(error("NOT_LOGGED", "No existe una sesión del usuario."));
  }

  const symbol = Object.values(Symbols.symbols).find(
    (s) => s.symbol === req.body.symbol
  );
  const quantity = parseFloat(req.body.quantity);
  const type = req.body.type;

  if (!symbol) {
    return res.json(
      error("INVALID_SYMBOL", "No se ha encontrado el símbolo especificado.")
    );
  }

  if (isNaN(quantity) || quantity <= 0) {
    return res.json(
      error("INVALID_QUANTITY", "La cantidad introducida no es válida.")
    );
  }
  //TODO: prices
  const symbolPriceObject = Object.values(prices).find(
    (p) => p.symbol === symbol.symbol
  );
  if (!symbolPriceObject) {
    return res.json(
      error(
        "NO_SERVER_PRICE",
        "El servidor no dispone de los precios actualmente. Inténtalo de nuevo más tarde."
      )
    );
  }

  const symbolPrice = symbolPriceObject.price;
  const paidAmount = parseFloat(quantity.toFixed(8));

  const removeAsset = type === "BUY" ? symbol.quoteAsset : symbol.baseAsset;
  const addAsset = type === "BUY" ? symbol.baseAsset : symbol.quoteAsset;

  const paidAssetName =
    type === "BUY" ? symbol.quoteAssetName : symbol.baseAssetName;

  db.query(
    `SELECT quantity FROM cartera WHERE coin LIKE '${removeAsset}' AND user = ${req.session.user.ID};`,
    (err, result) => {
      if (err)
        return res.json(
          error("SELECT_ERROR", "Se ha producido un error inesperado")
        );

      const currentAmount =
        result.length === 0 ? -1 : parseFloat(result[0].quantity.toFixed(8));
      if (currentAmount < paidAmount) {
        return res.json(
          error(
            "INSUFFICIENT_BALANCE",
            `No tienes suficientes ${paidAssetName}.`
          )
        );
      }

      const comission = parseFloat((paidAmount * tradingComision).toFixed(8));
      const receivedAmount =
        type === "BUY"
          ? (paidAmount - comission) / symbolPrice
          : (paidAmount - comission) * symbolPrice;

      const updatedAmount = currentAmount - paidAmount;
      const updateQuery =
        updatedAmount === 0
          ? `DELETE FROM cartera WHERE coin = '${removeAsset}' AND user = ${req.session.user.ID};`
          : `UPDATE cartera SET quantity = ${updatedAmount.toFixed(
              8
            )} WHERE coin = '${removeAsset}' AND user = ${
              req.session.user.ID
            };`;

      db.query(updateQuery, (err, _) => {
        if (err)
          return res.json(
            error("UPDATE_ERROR", "Se ha producido un error inesperado")
          );

        db.query(
          `SELECT quantity FROM cartera WHERE coin = '${addAsset}' AND user = ${req.session.user.ID};`,
          (err, result) => {
            if (err)
              return res.json(
                error("SELECT_ERROR", "Se ha producido un error inesperado")
              );

            const currentQuoteAmount =
              result.length === 0
                ? -1
                : parseFloat(result[0].quantity.toFixed(8));
            const query =
              currentQuoteAmount >= 0
                ? `UPDATE cartera SET quantity = quantity + ${receivedAmount.toFixed(
                    8
                  )} WHERE coin = '${addAsset}' AND user = ${
                    req.session.user.ID
                  };`
                : `INSERT INTO cartera (user, coin, quantity) VALUES (${
                    req.session.user.ID
                  }, '${addAsset}', ${receivedAmount.toFixed(8)});`;

            db.query(query, (err, _) => {
              if (err)
                return res.json(
                  error("UPDATE_ERROR", "Se ha producido un error inesperado")
                );

              const currentDate = new Date();
              const year = currentDate.getFullYear();
              const month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Agrega un cero inicial si es necesario
              const day = ("0" + currentDate.getDate()).slice(-2); // Agrega un cero inicial si es necesario
              const hours = ("0" + currentDate.getHours()).slice(-2); // Agrega un cero inicial si es necesario
              const minutes = ("0" + currentDate.getMinutes()).slice(-2); // Agrega un cero inicial si es necesario
              const seconds = ("0" + currentDate.getSeconds()).slice(-2); // Agrega un cero inicial si es necesario

              const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

              const historyQuery = `INSERT INTO trade_history (user, symbol, type, paid_amount, amount_received, comission, date, price) VALUES 
                                    (${req.session.user.ID}, '${
                symbolPriceObject.symbol
              }', '${type}', ${paidAmount.toFixed(8)}, ${receivedAmount.toFixed(
                8
              )}, ${comission.toFixed(
                8
              )}, '${formattedDate}', ${symbolPrice});`;

              db.query(historyQuery, (err, _) => {
                if (err)
                  return res.json(
                    error(
                      "HISTORY_ERROR",
                      "Se ha producido un error inesperado"
                    )
                  );
              });

              return res.json({
                status: "1",
                comission: comission,
                paidAmount: paidAmount,
                receivedAmount: receivedAmount,
              });
            });
          }
        );
      });
    }
  );
});

app.post("/payment", (req, res) => {
  if (!req.session.user) {
    res.json(error("NOT_LOGGED", "No existe una sesión del usuario."));
  } else if (!req.body.cart || !req.body.cart.type || !req.body.cart.quantity) {
    res.json(
      error("MALFORMED_REQUEST", "La petición no se ha formulado correctamente")
    );
  } else {
    const cart = req.body.cart;
    db.query(
      `SELECT coin FROM cartera where coin like '${cart.type}' and user = ${req.session.user.ID}`,
      (err, result) => {
        if (err) {
          res.json(
            error("SELECT_ERROR", "Se ha producido un error inesperado")
          );
        } else if (result.length === 0) {
          db.query(
            `INSERT INTO cartera (user, coin, quantity) VALUES (${req.session.user.ID}, '${cart.type}', ${cart.quantity})`,
            (err, _) => {
              if (err) {
                res.json(
                  error("INSERT_ERROR", "Se ha producido un error inesperado")
                );
              }

              const currentDate = new Date();
              const year = currentDate.getFullYear();
              const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
              const day = ("0" + currentDate.getDate()).slice(-2);
              const hours = ("0" + currentDate.getHours()).slice(-2);
              const minutes = ("0" + currentDate.getMinutes()).slice(-2);
              const seconds = ("0" + currentDate.getSeconds()).slice(-2);

              const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

              db.query(
                `INSERT INTO payment_history (user, type, quantity, date, method, info) VALUES 
                (${req.session.user.ID}, 'PAY', ${
                  cart.quantity
                }, '${formattedDate}', '${req.body.method.type.toUpperCase()}', '${
                  req.body.method.info
                }')`,
                (err, _) => {
                  if (err) {
                    res.json(
                      error(
                        "HISTORY_ERROR",
                        "Se ha producido un error inesperado"
                      )
                    );
                  }

                  res.json({
                    status: 1,
                    feedback: "OK",
                  });
                }
              );
            }
          );
        } else {
          db.query(
            `UPDATE cartera SET quantity = quantity + ${cart.quantity} WHERE user = ${req.session.user.ID} and coin like '${cart.type}'`,
            (err, _) => {
              if (err) {
                res.json(
                  error("UPDATE_ERROR", "Se ha producido un error inesperado")
                );
              }

              const currentDate = new Date();
              const year = currentDate.getFullYear();
              const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
              const day = ("0" + currentDate.getDate()).slice(-2);
              const hours = ("0" + currentDate.getHours()).slice(-2);
              const minutes = ("0" + currentDate.getMinutes()).slice(-2);
              const seconds = ("0" + currentDate.getSeconds()).slice(-2);

              const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

              db.query(
                `INSERT INTO payment_history (user, type, quantity, date, method, info) VALUES 
                (${req.session.user.ID}, 'PAY', ${
                  cart.quantity
                }, '${formattedDate}', '${req.body.method.type.toUpperCase()}', '${
                  req.body.method.info
                }')`,
                (err, _) => {
                  if (err) {
                    res.json(
                      error(
                        "HISTORY_ERROR",
                        "Se ha producido un error inesperado"
                      )
                    );
                  }

                  res.json({
                    status: 1,
                    feedback: "OK",
                  });
                }
              );
            }
          );
        }
      }
    );
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
  res.json({ coins: coins, last_update: last_update });
  applog(`Petición "/coins" ejecutada`, "REQUEST");
});

app.get("/prices", (req, res) => {
  const symbol = req.query.symbol;
  if (symbol !== undefined) {
    const price = prices.find((price) => price.symbol === symbol);
    res.json(price);
    applog(
      `Petición "/prices" del simbolo ` + symbol + ` ejecutada`,
      "REQUEST"
    );
  } else {
    res.json(prices);
    applog(`Petición "/prices" ejecutada`, "REQUEST");
  }
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
