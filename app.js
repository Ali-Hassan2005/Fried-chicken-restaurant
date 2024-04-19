var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
//logger
var logger = require("morgan");

var db = require("./configs/db");

const error = require("./middlewares/error_handle");

// import routes

var clientRouter = require("./routes/clients");
var userRouter = require("./routes/users");
var categoryRouter = require("./routes/category");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
//routes
app.use("/api/client", clientRouter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);

//not found
app.use(error.notfound);
// error handler
app.use(error.errorhandler);
db();
module.exports = app;
