var User = require("../models/User");
var generateToken = require("../configs/generateToken");
var sendEmail = require("../configs/sendEmail");
var jwt = require("jsonwebtoken");
require("dotenv").config();

exports.store = async (req, res, next) => {
  // check validation

  // create
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      msg: "user created successfully",
      data: user,
    });
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const error = new Error("password or email not correct");
  error.statusCode = 404;
  // Check username
  let user;
  try {
    user = await User.findOne({ email });
    if (!user) {
      throw error;
    }
  } catch (err) {
    return next(error);
  }

  // Check password
  try {
    if (!(await user.isPasswordMatched(password))) {
      throw error;
    }
  } catch (err) {
    return next(error);
  }
  

  // generate token
  const token = await generateToken.Login(user._id.toString());
  res.status(200).json({
    msg: "login successful",
    token: token,
  });
};

exports.forgotPassword = async (req, res, next) => {
  const email = req.body.email;
  var user;
  var token;
  try {
    user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }
    token = await generateToken.resetPassword(user._id.toString());
    user.resestpasswordToken = token;
    await user.save();
  } catch (err) {
    return next(error);
  }

  try {
    await sendEmail({
      email: email,
      subject: "reset password",
      html: `<h1><a href = "${req.url}/api/resetpassword/${token}" >click here </a></h>`,
    });
    res.status(200).json({
      msg: "success",
      token: token,
    });
  } catch (error) {
    const err = new Error(" failed to send email");
    err.statusCode = 500;
    return next(error);
  }
};
exports.resetPassword = async (req, res, next) => {
  const { password, token } = req.body;
  try {
    var decoded = jwt.verify(token, process.env.jwt_secretkey_resetpassword);
  } catch (error) {
    const err = new Error(" token is not valid");
    err.statusCode = 401;
    return next(err);

  }
  try {
    const user = await User.findOne({ resestpasswordToken: token });
    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }
    user.password = password;
    await user.save();
    res.status(200).json({
      msg: "success reset password",
    });
  } catch (error) {
    next(error);
  }
};
