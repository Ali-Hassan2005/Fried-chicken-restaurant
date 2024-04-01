const mongoose = require("mongoose");
require("dotenv").config();

const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.slsu9nk.mongodb.net/${process.env.DB_NAME}`;

module.exports = async () => {
  try {
    await mongoose.connect(url);
    console.log("successfully connected");
  } catch (err) {
    console.log("error connecting");
  }
};
