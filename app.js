var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");

var db = require("./configs/db");

const error = require("./middlewares/error_handle");

var app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//not found
app.use(error.notfound);
// error handler
app.use(error.errorhandler);
db();
module.exports = app;
