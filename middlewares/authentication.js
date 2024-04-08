var jwt = require("jsonwebtoken");
var User = require("../models/User");
require("jsonwebtoken");

module.exports = async (req, res, next) => {
  let token;
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
    const user = await User.findById(decoded.userid);
    if (!user) {
      throw err;
    }
    if (user.ischangedPassword(decoded.iat)) {
      throw err;
    }
    req.user = user;
    next();
  } catch (error) {
    return next(err);
  }
};
