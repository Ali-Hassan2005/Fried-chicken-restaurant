const Category = require("../models/Category");

exports.addCategory = async (req, res, next) => {
  const { name } = req.body;
  try {
    const category = await Category.create({
      name: name,
    });

    res.status(200).json({
      msg: "Category added successfully",
      category: category,
    });
  } catch (err) {
    const error = new Error("Could not create an category");
    error.statusCode = 500;
    return next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.find();
    res.status(200).json({
      msg: "Category fetched successfully",
      category: category,
    });
  } catch (err) {
    const error = new Error("Could not fetch an category");
    error.statusCode = 500;
    return next(error);
  }
};

exports.delete = async (req, res, next) => {
  const id = req.params.id;
  var category;
  try {
    category = await Category.findOneAndDelete({ _id: id });
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    msg: "deleted successfully",
    data: category,
  });
};
