var express = require("express");
var router = express.Router();
var categoryController = require("../controllers/category.controller");
var isAuthenticated = require("../middlewares/authentication");
var authorization = require("../middlewares/authorization");

router.get("/", categoryController.getAllCategory);
router.use(isAuthenticated("user", authorization("admin")));
router.post("/", categoryController.store);
router.put("/:id", categoryController.update);
router.delete("/:id", categoryController.delete);

module.exports = router;
