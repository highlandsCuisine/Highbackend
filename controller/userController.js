//package imports
const User = require("../model/user");
const { signOut } = require("firebase/auth");
//local Imports
const { auth } = require("../database/firebase");
const { trycatch } = require("../helpers/trycatch");
const UserResponse = require("../model/userResponse");
const { ErrorHandler } = require("../helpers/errrorHandling");
const { setCookie } = require("../middleware/cookieMiddleware");
const {
  createUser,
  signInExistingUser,
  resetPassword,
} = require("../service/authServices");

exports.signupUser = trycatch(async (req, res, next) => {
  const { firstName, lastName, email, password, phone } = await req.body;
  const newUser = new User(
    `${firstName}#${lastName}#${phone}#user`,
    email,
    password,
    `+977${phone}`
  );
  const createNewUser = await createUser(newUser);
  if (!createNewUser) {
    return next(new ErrorHandler(500));
  }
  res.status(201).json({
    success: true,
    message: "User Create successfully",
  });
});

exports.loginUser = trycatch(async (req, res, next) => {
  const { email, password } = await req.body;
  const existingUser = await signInExistingUser(email, password);
  if (!existingUser) {
    return next(new ErrorHandler(500));
  }
  const userRes = new UserResponse(
    existingUser.user.displayName.split("#")[0],
    existingUser.user.email,
    existingUser.user.phoneNumber,
    existingUser.user.displayName.split("#")[3],
    existingUser.user.uid
  );
  setCookie(res, "_login_info", existingUser.user.stsTokenManager.accessToken);
  res.status(200).json({
    success: true,
    isLogged: true,
    uid: userRes.uid,
    email: userRes.email,
    user: userRes.user,
    phone: userRes.phone,
    role: userRes.role,
  });
});

exports.resetPassword = trycatch(async (req, res, next) => {
  const { email } = await req.body;
  const resetPasswordLink = await resetPassword(email);
  if (!resetPasswordLink) {
    return next(new ErrorHandler(500));
  }
  const data = await ejs.renderFile("views/emailTemplate/passwordReset.ejs", {
    resetPasswordLink,
  });
  sendEmail({
    to: email,
    subject: "Password Reset!",
    html: data,
  });
  return res.status(201).json({
    success: true,
    message: "Password Reset Link has been sent to your email!",
  });
});

exports.logOut = trycatch(async (req, res, next) => {
  const loggedOutUser = await signOut(auth);
  if (!loggedOutUser) {
    return next(new ErrorHandler(500));
  }
  res.status(200).json({ sucess: true, isLogged: false });
});

exports.isAuth = trycatch(async (req, res, next) => {
  const token = (await req.cookies._login_info)
    ? await req.cookies._login_info
    : null;
  if (!token) {
    return next(new ErrorHandler(401));
  }
  const verifyTokens = await this.isAuth(token);
  if (!verifyTokens) {
    return next(new ErrorHandler(401));
  }
  res.status(200).json({
    success: true,
    message: "ok",
    data: {
      isAuth: true,
    },
  });
});
