var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const cors = require("cors");
var indexRouter = require("./routes/index");
const utils = require("./utils/utils");

var app = express();

require("dotenv").config();

const url = process.env.SERVER_URL;
utils.applog(`Server URL: ${url}`, "SERVER");

app.use(logger("dev"));

app.use(express.json());
app.use(session({ secret: "IEEE754" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
    cors({
        origin: url,
        credentials: true,
    })
);

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({ error: err.message });
});

module.exports = app;
