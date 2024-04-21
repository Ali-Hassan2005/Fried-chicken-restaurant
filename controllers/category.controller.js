const Category = require("../models/Category");

exports.store = async (req, res, next) => {
  const { title, description } = req.body;
  try {
    const category = await Category.create({
      title,
      description,
    });

    res.status(200).json({
      msg: "Category added successfully",
      data: category,
    });
  } catch (err) {
    const error = new Error("Could not create an category");
    error.statusCode = 500;
    return next(error);
  }
};

exports.getAllCategory = async (req, res, next) => {
  try {
    const category = await Category.find();
    res.status(200).json({
      msg: "Category fetched successfully",
      data: category,
    });
  } catch (err) {
    const error = new Error("Could not fetch a category");
    error.statusCode = 500;
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  const id = req.params.id;
  const { title, description } = req.body;
  try {
    const category = await Category.findOneAndUpdate(
      { _id: id },
      { title, description },
      {
        returnDocument: "after",
      }
    );
    res.status(200).json({
      msg: "Category updated successfully",
      data: category,
    });
  } catch (err) {
    const error = new Error("Could not update a category");
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
