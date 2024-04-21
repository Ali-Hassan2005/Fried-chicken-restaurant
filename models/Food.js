const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var foodSchema = new mongoose.Schema(
  {
    title: {
      required: true,
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    imageUrl: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Food", foodSchema);
