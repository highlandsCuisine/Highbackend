const acceptingmethods = require("../config/acceptingMethods");
const { ErrorHandler } = require("../helpers/errrorHandling");

exports.allowedMethods = (req, res, next) => {
  if (!acceptingmethods.includes(req.method)) {
    return next(new ErrorHandler(405));
  }
  next();
};
