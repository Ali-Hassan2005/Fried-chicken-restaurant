exports.errorhandler = async (err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode;
  const message = err.message;
  res.status(statusCode).json({
    msg: message,
  });
};

exports.notfound = async (req, res, next) => {
  res.status(404).json({
    msg: "Not Found",
  });
};
