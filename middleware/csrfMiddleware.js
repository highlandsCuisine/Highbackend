const { doubleCsrf } = require("csrf-csrf");

//csrf protection (convert secure options to true in production)
const csrfMiddleware = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,
  cookieName: "x-csrf-token",
  cookieOptions: {
    sameSite: "lax",
    secure: true,
    signed: true,
  },
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getTokenFromRequest: (req) =>
    req.headers["x-csrf-token"]
      ? req.headers["x-csrf-token"]
      : req.body["x-csrf-token"],
});

//Error handling, validation Error
const csrfErrorHandler = (error, req, res, next) => {
  if (error == csrfMiddleware.invalidCsrfTokenError) {
    return res.status(400).json({
      success: false,
      message: "csrf validation error!",
    });
  }
  next();
};

module.exports = {
  doubleCsrfProtection: csrfMiddleware.doubleCsrfProtection,
  generateToken: csrfMiddleware.generateToken,
  csrfErrorHandler,
};
