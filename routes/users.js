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
router.put(
  "/update/:id",
  isAuthenticated("user"),
  authorization("admin"),
  userController.updateByAdmin
);
//update user
router.put("/update", isAuthenticated("user"), userController.update);
//get user
router.get("/profile", isAuthenticated("user"), userController.getUser);
//get user by admin
router.get(
  "/:id",
  isAuthenticated("user"),
  authorization("admin"),
  userController.getUserbyAdmin
);
//get all users
router.get(
  "/",
  isAuthenticated("user"),
  authorization("admin"),
  userController.getAllUsers
);
//delete user by admin
router.delete(
  "/delete/:id",
  isAuthenticated("user"),
  authorization("admin"),
  userController.deleteUserbyAdmin
);
//delete user
router.delete(
  "/delete",
  isAuthenticated("user"),
  userController.delete
);
//active
router.put(
  "/Active/:id",
  isAuthenticated("user"),
  authorization("admin"),
  userController.Activate
);
//non active
router.put(
  "/nonActive/:id",
  isAuthenticated("user"),
  authorization("admin"),
  userController.nonActivate
);
module.exports = router;
