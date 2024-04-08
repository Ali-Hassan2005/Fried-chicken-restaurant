module.exports = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const err = new Error("is not authorized to access this role");
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
};
