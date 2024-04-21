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
      required: true,
    },
    imageUrl: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    rates: [
      {
        clientID: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
        rate: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Food", foodSchema);
