var express = require("express");
var router = express.Router();

const userController = require("../controller/userController");
const historyController = require("../controller/historyController");
const walletController = require("../controller/walletController");
const { apiController } = require("../controller/APIController");

/* GET home page. */
router.get("/", function (req, res, next) {
    res.json({ message: "Hello InfoWorld!" });
});

router.get("/auth", userController.auth); //checked

router.post("/login", userController.login); //checked

router.get("/logout", userController.logout); //Checked

router.post("/checkemail", userController.checkEmail); //checked

router.post("/register", userController.register); //Checked

router.get("/bizum_history", historyController.bizumHistory); //Checked

router.post("/bizum", walletController.bizum); //Checked

router.get("/bizum_users", userController.bizumUsers); //Checked

router.post("/swap_mode", userController.swap); //Checked

router.get("/admin", userController.admin); //Checked

router.get("/wallet", walletController.wallet); //Checked

router.get("/payment_history", historyController.paymentHistory); //Checked

router.get("/trade_history", historyController.tradeHistory); //Checked

router.post("/trade", walletController.trade); //checked

router.post("/payment", walletController.payment); //checked

router.get("/users", userController.users); //checked

router.get("/coins", apiController.coins); //Checked

router.get("/prices", apiController.prices);

router.post("/withdraw", walletController.withdraw);

router.get("/terms", apiController.terms);

module.exports = router;
