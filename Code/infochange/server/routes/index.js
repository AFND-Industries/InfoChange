const express = require("express");
const router = express.Router();

const userController = require("../controller/user");
const apiController = require("../controller/api");

// API Routes
router.get("/prices", apiController.getPrices);
router.get("/coins", apiController.getCoins);
router.get("/", apiController.hello);

module.exports = router;
