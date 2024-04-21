const { Router } = require("express");
const { store, getAllFood } = require("../controllers/food.controller");
var isAuthenticated = require("../middlewares/authentication");
var authorization = require("../middlewares//authorization");

const routes = Router();

// store
routes.post("/", isAuthenticated("user"), authorization("admin"), store);
routes.get("/", getAllFood);

module.exports = routes;
