const { trycatch } = require("../helpers/trycatch");
const acceptingMedia = require("../config/acceptingMedia");
const { ErrorHandler } = require("../helpers/errrorHandling");

exports.checkContentType = trycatch((req, res, next) => {
  const contentType = req.headers["content-type"];
  if (
    req.method !== "GET" &&
    contentType &&
    !acceptingMedia.some((allowedType) => contentType.includes(allowedType))
  ) {
    return next(new ErrorHandler(415));
  }

  next();
});
