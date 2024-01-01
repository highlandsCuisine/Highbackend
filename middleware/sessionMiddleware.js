const session = require("express-session");

module.exports = session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  name: "_s_info",
  cookie: {
    secure: false,
    priority: "high",
    httpOnly: true,
    maxAge: 3540000,
    sameSite: "lax",
  },
});
