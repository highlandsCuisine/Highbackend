const { ErrorHandler } = require("./errrorHandling");
const { trycatch } = require("./trycatch");
const { logActivity } = require("./userLog");

exports.logger = (...title) => {
  return trycatch(async (req, res, next) => {
    const user = await req.session.user;
    await logActivity(user.uid, title, (success, message) => {
      if (!success) {
        return next(new ErrorHandler(500, message));
      }
      next();
    });
  });
};
