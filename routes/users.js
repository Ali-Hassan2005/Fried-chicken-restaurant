var express = require("express");
var router = express.Router();
var userController = require("../controllers/user.controller");
var isAuthenticated = require("../middlewares/authentication");
var authorization = require("../middlewares//authorization");

//create new user
router.post(
  "/",
  isAuthenticated("user"),
  authorization("admin"),
  userController.store
);
//login user
router.post("/login", userController.login);
//forgot password
router.post("/forgotPassword", userController.forgotPassword);
//reset password
router.put("/resetPassword", userController.resetPassword);
//update userRole by admin

//update user
router.put("/update", isAuthenticated("user"), userController.update);
//get user by admin
//get user
//get all users
//delete user by admin
//delete user
//active
//non active
module.exports = router;
