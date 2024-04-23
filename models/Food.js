const { compare } = require("bcryptjs");
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
    preview: [
      {
        client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
        stars: { type: Number, enum: [1, 2, 3, 4, 5] },
        Comment: { type: String },
      },
    ],
    rateing: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

//Export the model
foodSchema.methods.addPreview = async function (
  clientID,
  stars,
  Comment = null
) {
  let overRate = 0;
  let flag = false;
  this.preview.forEach((i) => {
    if (i.client.toString() === clientID.toString()) {
      flag = true;
      i.stars = stars;
      i.Comment = Comment;
    }
    overRate += i.stars;
  });
  if (!flag) {
    overRate += stars;
    this.preview.push({
      client: clientID,
      stars: stars,
      Comment: Comment,
    });
  }
  this.handleRateing(overRate);
  return await this.save();
};

foodSchema.methods.handleRateing = function (overRate) {
  const rate = (overRate / (this.preview.length * 5)) * 5;
  console.log(this.preview.length);
  console.log(overRate);
  console.log(rate);
  this.rateing = rate;
};
module.exports = mongoose.model("Food", foodSchema);
