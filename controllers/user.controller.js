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
    user.resetPasswordAt = Date.now();
    await user.save();
    res.status(200).json({
      msg: "success reset password",
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  const { email, name, username } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        email: email,
        name: name,
        username: username,
      },
      {
        returnDocument: "after",
      }
    );
    res.status(200).json({
      msg: "success update",
      data: {
        user: user,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateByAdmin = async (req, res, next) => {
  const id = req.params.id;
  const { email, name, username, role } = req.body;
  var user;
  try {
    user = await User.findOneAndUpdate(
      { _id: id },
      {
        email,
        username,
        name,
        role,
      },
      {
        returnDocument: "after",
      }
    );
  } catch (error) {
    return next(error);
  }
  res.status(200).json({
    msg: "success update",
    data: user,
  });
};
exports.getUserbyAdmin = async (req, res, next) => {
  const id = req.params.id;
  var user;
  try {
    user = await User.findById(id);
    res.status(200).json({
      msg: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
exports.getUser = async (req, res, next) => {
  const id = req.user._id;
  var user;
  try {
    user = await User.findOne({_id: id});
    res.status(200).json({
      msg: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    // filter

    const excluded = ["sort", "page", "limit", "fields"];
    const queryObj = { ...req.query };
    excluded.forEach((element) => delete queryObj[element]);
    const querySTR = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (val) => `$${val}`
    );

    let query = User.find(JSON.parse(querySTR));

    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query.sort(sortBy);
    } else {
      query.sort("-createdAt");
    }

    // limit fileds
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query.select(fields);
    } else {
      query.select("-__v");
    }

    //pagination
    if (req.query.limit && req.query.page) {
      const page = req.query.page;
      const limit = req.query.limit;
      query.skip((page - 1) * limit).limit(limit);
    }

    const users = await query;
    res.status(200).json({
      msg: "successful fetch",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUserbyAdmin = async (req, res, next) => {
  const id = req.params.id;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({
      msg: "successful delete",
    });
  } catch (err) {
    next(err);
  }
};
exports.delete = async (req, res, next) => {
  const id = req.user._id;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({
      msg: "successful delete",
    });
  } catch (err) {
    next(err);
  }
};

exports.Activate = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    user.Activate();
    await user.save();
    res.status(200).json({
      msg: "successful activate",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
exports.nonActivate = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    user.nonActivate();
    await user.save();
    res.status(200).json({
      msg: "successful activate",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
