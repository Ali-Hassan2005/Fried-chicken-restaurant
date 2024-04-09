const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
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
      default: true,
    },
    resetPasswordAt: {
      type: Date,
    },
    resestpasswordToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function () {
  if (this.isModified("password")) {
    var salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }
});

userSchema.methods.isActived = function () {
  return this.isActive;
};
userSchema.methods.isChangedPassword = function (jwtDate) {
  if (this.resetPasswordAt) {
    return parseInt(this.resetPasswordAt.getTime()) / 1000 > jwtDate;
  }
  return false;
};
userSchema.methods.isPasswordMatched = function (password) {
  return bcrypt.compareSync(password, this.password);
};

//Export the model
module.exports = mongoose.model("User", userSchema);
