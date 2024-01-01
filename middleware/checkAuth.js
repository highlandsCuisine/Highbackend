const { admin } = require("../database/firebase");
const { trycatch } = require("../helpers/trycatch");

exports.isAuthenticated = trycatch(async (req, res, next) => {
  const token = await req.session.user;

  if (!token) {
    return res.redirect("/admin/highlands/cuisine/login");
  }

  const verifyTokens = await admin.auth().verifyIdToken(token.act);

  if (!verifyTokens) {
    return res.redirect("/admin/highlands/cuisine/login");
  }
  return true && next();
});
