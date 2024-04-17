var express = require("express");
var router = express.Router();
var clientController = require("../controllers/client.controller");
var isAuthenticated = require("../middlewares/authentication");
var authorization = require("../middlewares//authorization");

/* GET users listing. */
router.post("/signup", clientController.Signup);
router.post("/login", clientController.Login);
router.post("/forgotPassword", clientController.forgotPassword);

router.post("/verfiyOtp", clientController.verifyOtp);
//reset password
router.put("/resetPassword", clientController.resetPassword);
//update password
router.put("/updateEmail", isAuthenticated("client"), clientController.edit);

// block
router.post(
  "/block/:id",
  isAuthenticated("user"),
  authorization("admin"),
  clientController.block
);
//unblock
router.post(
  "/unblock/:id",
  isAuthenticated("user"),
  authorization("admin"),
  clientController.unblock
);

//delete account

router.delete("/delete", isAuthenticated("client"), clientController.delete);

//

module.exports = router;
