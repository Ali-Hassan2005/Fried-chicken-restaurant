const Food = require("../models/Food");

exports.store = async (req, res, next) => {
  const { title, price, categoryId } = req.body;
  var food;
  try {
    food = await Food.create({
      title,
      price,
      category: categoryId,
    });
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    msg: "success store created",
    data: food,
  });
};
exports.getAllFood = async (req, res, next) => {
  try {
    // filter

    const excluded = ["sort", "page", "limit", "fields"];
    const queryObj = { ...req.query };
    excluded.forEach((element) => delete queryObj[element]);
    const querySTR = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (val) => `$${val}`
    );

    let query = Food.find(JSON.parse(querySTR));

    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query.sort(sortBy);
    } else {
      query.sort("-createdAt");
    }

    // limit fileds
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query.select(fields);
    } else {
      query.select("-__v");
    }

    //pagination
    if (req.query.limit && req.query.page) {
      const page = req.query.page;
      const limit = req.query.limit;
      query.skip((page - 1) * limit).limit(limit);
    }

    const food = await query;
    res.status(200).json({
      msg: "successful fetch",
      data: food,
    });
  } catch (err) {
    next(err);
  }
};
exports.getFood = async (req, res, next) => {
  const id = req.params.id;
  var food;
  try {
    food = await Food.findById(id);
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    msg: "successful fetch",
    data: food,
  });
};
exports.update = async (req, res, next) => {
  const id = req.params.id;
  const { title, price, categoryId } = req.body;
  var food;
  try {
    food = await Food.findOneAndUpdate(
      { _id: id },
      {
        title,
        price,
        category: categoryId,
      },
      {
        returnDocument: "after",
      }
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    msg: "success store created",
    data: food,
  });
};
exports.delete = async (req, res, next) => {
  const id = req.params.id;
  var food;
  try {
    food = await Food.findOneAndDelete({ _id: id });
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    msg: "success store created",
    data: food,
  });
};
exports.addRate = async (req, res, next) => {
    
};
