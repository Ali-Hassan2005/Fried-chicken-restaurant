var express = require("express");
var router = express.Router();
var clientController = require("../controllers/client.controller");
var isAuthenticated = require("../middlewares/authentication");

/* GET users listing. */
router.post("/signup", clientController.Signup);
router.post("/login", clientController.Login);
router.post("/forgotPassword", clientController.forgotPassword);
//reset password
router.put("/resetPassword", clientController.resetPassword);

module.exports = router;
