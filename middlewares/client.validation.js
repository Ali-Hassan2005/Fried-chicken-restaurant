const { body, validationResult } = require("express-validator");
const Client = require("../models/Client");
exports.signup = [
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("email is required")
    .not()
    .isEmpty()
    .withMessage("Please enter an email")
    .isLength({ max: 255 })
    .custom(async (value, { req }) => {
      try {
        const client = await Client.findOne({ email: value });
        if (client) {
          const error = new Error("Email already exists");
          error.statusCode = 409;
          throw error;
        }
        return true;
      } catch (err) {
        return next(err);
      }
    }),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Please enter valid password")
    .not()
    .isEmpty()
    .withMessage("Please enter a valid password")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .custom((value, { req }) => {
      return value === req.body.confirmPassword;
    })
    .withMessage("Password do not match"),

  body("user")
    .trim()
    .isLength({ max: 255 })
    .withMessage("please enter a valid name")
    .not()
    .isEmpty()
    .withMessage("name is required"),
  body("username")
    .trim()
    .isLength({ max: 255 })
    .withMessage("please enter a valid username")
    .not()
    .isEmpty()
    .withMessage("username is required")
    .custom(async (value, { req }) => {
      try {
        const client = await Client.findOne({ username: value });
        if (client) {
          const error = new Error("Username already exists");
          error.statusCode = 409;
          throw error;
        }
      } catch (err) {
        return next(err);
      }
    }),
];

exports.login = [
  body("email")
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage("please enter a valid name"),
  body("password")
    .isLength({ max: 255 })
    .withMessage("please enter a valid name"),
];
exports.resetPassword = [
    
];
