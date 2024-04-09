var jwt = require("jsonwebtoken");
var User = require("../models/User");
require("jsonwebtoken");

module.exports = (type) => {
  return async (req, res, next) => {
    let token;
    var person;
    const err = new Error(" is not authenticated !");
    err.statusCode = 401;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      return next(err);
    }
    try {
      const decoded = jwt.verify(token, process.env.jwt_secretkey_login);
      if (type === "user") {
          person = await User.findById(decoded.userid);
      } else if (type === "client") {
          person = await Client.findById(decoded.userid);
      }
      if (!person) {
        throw err;
      }
      if (person.isChangedPassword(decoded.iat)) {
        throw err;
      }

      if (type === "user") {
        req.user = person;
      } else if (type === "client") {
        req.client = person;
      }
      next();
    } catch (error) {
      return next(err);
    }
  };
};
