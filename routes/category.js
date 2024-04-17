var express = require("express");
var router = express.Router();
var categoryController = require("../controllers/category.controller");
var isAuthenticated = require("../middlewares/authentication");
var authorization = require("../middlewares/authorization");

router.post("/addCategory", categoryController.addCategory);
router.get("/getCategory", categoryController.getCategory);

module.exports = router;
