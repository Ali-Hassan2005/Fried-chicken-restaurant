const mongoose = require("mongoose"); // Erase if already required
var bcrypt = require("bcryptjs");

// Declare the Schema of the Mongo model
var clientSchema = new mongoose.Schema({
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
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
    },
  ],
  isBlock: {
    type: Boolean,
    default: false,
  },
  resetPasswordAt: {
    type: Date,
  },
  resetPasswordToken: {
    type: String,
  },
});

clientSchema.pre("save", function () {
  if (this.isModified("password")) {
    var salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }
});

clientSchema.methods.isBlocked = function () {
  return this.isBlock;
};

clientSchema.methods.isChangedPassword = function (jwtDate) {
  if (this.resetPasswordAt) {
    return parseInt(this.resetPasswordAt.getTime()) / 1000 > jwtDate;
  }
  return false;
};

clientSchema.methods.isPasswordMatched = function (password) {
  return bcrypt.compareSync(password, this.password);
};

//Export the model
module.exports = mongoose.model("Client", clientSchema);
