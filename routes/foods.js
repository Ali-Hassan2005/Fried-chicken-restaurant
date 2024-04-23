const { Router } = require("express");
const {
  store,
  getAllFood,
  getFood,
  update,
  deletefood,
  addPreview,
} = require("../controllers/food.controller");
var isAuthenticated = require("../middlewares/authentication");
var authorization = require("../middlewares//authorization");

const routes = Router();

// store
routes.post("/", isAuthenticated("user"), authorization("admin"), store);
//get all food
routes.get("/", getAllFood);
//get food
routes.get("/:id", getFood);
// update food
routes.put("/:id", isAuthenticated("user"), authorization("admin"), update);
// delete food
routes.delete(
  "/:id",
  isAuthenticated("user"),
  authorization("admin"),
  deletefood
);
// add rate
routes.post("/preview/:id",isAuthenticated("client"), addPreview);

module.exports = routes;
