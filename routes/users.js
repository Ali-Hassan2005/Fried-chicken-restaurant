var express = require("express");
var router = express.Router();
var userController = require("../controllers/user.controller");
var isAuthenticated = require("../middlewares/authentication");
var authorization = require("../middlewares//authorization");

//create new user
router.post("/", userController.store);
//login user
router.post("/login", userController.login);
//forgot password
router.post("/forgotPassword", userController.forgotPassword);
//reset password
router.put("/resetPassword", userController.resetPassword);

module.exports = router;
