const Client = require("../models/Client");
const generateToken = require("../configs/generateToken");
var sendEmail = require("../configs/sendEmail");
require("dotenv").config();
var jwt = require("jsonwebtoken");
var speakeasy = require("speakeasy");

exports.Signup = async (req, res, next) => {
  const client = new Client(req.body);
  try {
    await client.save();
    res.status(201).json({
      msg: "Client created successfully",
      client: client,
    });
  } catch (err) {
    const error = new Error("Could not create an email");
    error.statusCode = 500;
    return next(error);
  }
};

exports.Login = async (req, res, next) => {
  const { email, password } = req.body;
  const error = new Error("password or email not correct");
  error.statusCode = 404;
  let client;
  try {
    client = await Client.findOne({ email: email });
    if (!client) {
      throw error;
    }
    if (!client.isPasswordMatched(password)) {
      throw error;
    }
    const token = await generateToken.Login(client._id.toString());
    res.status(200).json({
      msg: "login successful",
      token: token,
    });
  } catch (err) {
    return next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const email = req.body.email;
  var client;
  var token;
  const secret = speakeasy.generateSecret({ length: 20 });
  const secretKey = secret.base32;
  const otp = await speakeasy.totp({
    secret: secretKey,
    encoding: "base32",
    step: 60,
  });
  try {
    client = await Client.findOne({ email: email });
    if (!client) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }
    token = await generateToken.resetPassword(client._id.toString());
    client.resetOtpSecret = secretKey;
    await client.save();
  } catch (error) {
    return next(error);
  }

  try {
    await sendEmail({
      email: email,
      subject: "reset password",
      html: `<h1> otp code: "${otp}"</h>`,
    });
    res.status(200).json({
      msg: "success",
      otp: otp,
    });
  } catch (error) {
    const err = new Error(" failed to send email");
    err.statusCode = 500;
    return next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  const { userotp, email } = req.body;

  const client = await Client.findOne({ email });
  try {
    if (!client) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }
    console.log(client.resetOtpSecret);
    const isValidOTP = await speakeasy.totp.verify({
      secret: client.resetOtpSecret,
      encoding: "base32",
      token: userotp,
      step: 60,
    });

    if (!isValidOTP) {
      const error = new Error("not valid OTP token");
      error.statusCode = 404;
      return next(error);
    }
    token = await generateToken.resetPassword(client._id.toString());
    client.resetPasswordToken = token;
    await client.save();
    res.status(200).json({
      msg: "success",
      token: token,
    });
  } catch (err) {
    return next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { token, password } = req.body;
  var client;
  try {
    client = await Client.findOne({ resetPasswordToken: token });
    if (!client) {
      const error = new Error("token not found");
      error.statusCode = 404;
      throw error;
    }
  } catch (err) {
    return next(err);
  }
  client.password = password;
  client.resetPasswordAt = Date.now();
  client.resetPasswordToken = null;
  try {
    await client.save();
    res.status(200).json({
      msg: "Password reset successfully",
      client: client,
    });
  } catch (err) {
    const error = new Error("Could not create an email");
    error.statusCode = 500;
    return next(error);
  }
};

exports.edit = async (req, res, next) => {
  var client;
  const { name, username, email } = req.body;
  try {
    client = await Client.findByIdAndUpdate(
      { _id: req.client._id },
      {
        name: name,
        username: username,
        email: email,
      },
      {
        returnDocument: "after",
      }
    );
    res.status(200).json({
      msg: "Account updated successfully",
      client: client,
    });
  } catch (err) {
    const error = new Error("Could not update an account");
    error.statusCode = 500;
    throw error;
  }
};

exports.block = async (req, res, next) => {
  const id = req.parms.id;
  const client = Client.findOneAndUpdate(
    { _id: id },
    {
      isBlock: true,
    }
  );
};

exports.unblock = async (req, res, next) => {
  const id = req.parms.id;
  const client = Client.findOneAndUpdate(
    { _id: id },
    {
      isBlock: false,
    }
  );
};
exports.delete = async (req, res, next) => {
  try {
    var client = await Client.findByIdAndDelete({ _id: req.client._id });
    if (!client) {
      const error = new Error("you are not allowed to delete");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      msg: "Account deleted successfully",
    });
  } catch (err) {
    const error = new Error("Could not delete an account");
    error.statusCode = 500;
    throw error;
  }
};

exports.getClient = async (req, res, next) => {
  const id = req.client._id;
  var client;
  try {
    client = await Client.findOne({ _id: id });
    res.status(200).json({
      msg: "success",
      data: client,
    });
  } catch (error) {
    next(error);
  }
};
