var express = require("express");
var router = express.Router();

const userController = require("../controller/userController");
const historyController = require("../controller/historyController");
const walletController = require("../controller/walletController");
const apiController = require("../controller/APIController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ message: "Hello InfoWorld!" });
});

router.get("/auth", userController.auth);

router.post("/login", userController.login);

router.get("/logout", userController.logout);

router.post("/checkemail", userController.checkEmail);

router.post("/register", userController.register);

router.get("/bizum_history", historyController.bizumHistory);

router.post("/bizum", walletController.bizum);

router.get("/bizum_users", userController.bizumUsers);

router.get("swap_mode", userController.swap);

router.get("/admin", userController.admin);

router.get("/wallet", walletController.wallet);

router.get("/trade_history", historyController.tradeHistory);

router.post("/trade", walletController.trade);

router.post("/payment", walletController.payment);

router.get("/users", userController.users);

router.get("/coins", apiController.coins);

router.get("/prices", apiController.prices);

router.get("/payment_history", historyController.paymentHistory);

module.exports = router;
