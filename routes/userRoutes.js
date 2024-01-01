const express = require("express");
const {
  signupUser,
  resetPassword,
  logOut,
  loginUser,
  isAuth,
} = require("../controller/userController");
const {
  doubleCsrfProtection,
  csrfErrorHandler,
} = require("../middleware/csrfMiddleware");

const router = express.Router();

router.post("/signup", signupUser);

router.post("/signin", doubleCsrfProtection, csrfErrorHandler, loginUser);

router.post("/reset", resetPassword);

router.post("/signout", logOut);

router.get("/isauth", isAuth);

module.exports = router;
