var express = require("express");
var router = express.Router();
var foodController = require("../controllers/food.controller");
var isAuthenticated = require("../middlewares/authentication");
var authorization = require("../middlewares//authorization");

router.post("/addFood", foodController.store);
router.get("/getAllFood", foodController.getAllFood);
router.get("/getFood/:id", foodController.getFood);

module.exports = router;
