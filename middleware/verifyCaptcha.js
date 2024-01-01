const axios = require("axios");
const { trycatch } = require("../helpers/trycatch");
const { generateNonce } = require("./nonceMiddleware");

exports.verifyCaptcha = trycatch(async (req, res, next) => {
  const captcha = await req.body["g-recaptcha-response"];
  const nonce = generateNonce();
  if (captcha === undefined || captcha === "" || captcha === null) {
    req.flash("alert", "Captcha Verification Error!");
    return res.render("login", {
      nonce: nonce,
      secret: process.env.RECAPTCHA_SECRET_CLIENT,
      alertMessage: req.flash("alert"),
    });
  }

  const verify = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captcha}`
  );
  if (verify.data.success) {
    return next();
  }
  req.flash("alert", "Captcha Verification Error!");
  return res.render("login", {
    nonce: nonce,
    secret: process.env.RECAPTCHA_SECRET_CLIENT,
    alertMessage: req.flash("alert"),
  });
});
