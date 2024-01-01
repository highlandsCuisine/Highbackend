const { admin } = require("../database/firebase");
const { trycatch } = require("../helpers/trycatch");
const { ErrorHandler } = require("../helpers/errrorHandling");

exports.isUserValid = trycatch(async (req, res, next) => {
  const token = (await req.cookies._login_info)
    ? await req.cookies._login_info
    : null;

  if (!token) {
    throw new ErrorHandler(401);
  }

  const verifyTokens = await admin.auth().verifyIdToken(JSON.parse(token));
  if (!verifyTokens) {
    res.clearCookie("_login_info", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    throw new ErrorHandler(401);
  }
  next();
});
