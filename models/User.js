const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["manager", "admin", "employee"],
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  resetPasswordAt: {
    type: Date,
  },
});

userSchema.pre("save", function () {
  if (this.isModified("password")) {
    var salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }
});

userSchema.methods.isActive = function () {
  return this.isActive;
};
userSchema.methods.ischangedPassword = function (jwtDate) {
  if (this.resetPasswordAt) {
    return parseInt(this.resetPasswordAt.getTime()) / 1000 > jwtDate;
  }
  return false;
};
userSchema.methods.isPasswordMathched = function (password) {
  return bcrypt.compareSync(password, this.password);
};

//Export the model
module.exports = mongoose.model("User", userSchema);
