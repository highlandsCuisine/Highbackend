const {
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} = require("firebase/auth");
const crypto = require("crypto");
const { ErrorHandler } = require("../helpers/errrorHandling");
const { trycatch } = require("../helpers/trycatch");
const { auth, admin, db } = require("../database/firebase");
const { getUserLogs } = require("../helpers/userLog");
const { validationResult } = require("express-validator");
const { getDocs, collection } = require("firebase/firestore");
const { readTracks } = require("./menuController");

const {
  readMyBalance,
  refundedBalance,
  readPayments,
} = require("../service/paymentService");
const { totalOrders } = require("../service/databaseServices");

exports.loginPage = trycatch(async (req, res) => {
  if (await req.session.user) {
    return res.redirect("/admin/highlands/cuisine/logout");
  }
  const nonce = crypto.randomBytes(16).toString("base64");

  res.render("login", {
    alertMessage: "",
    secret: process.env.RECAPTCHA_SECRET_CLIENT,
    nonce,
    token: req.csrfToken(true),
  });
});

exports.signupAdmin = trycatch(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(({ msg }) => msg);
    return res.status(400).json({
      success: false,
      errors: errorMessages,
    });
  }
  const { firstName, lastName, email, password, phone } = await req.body;
  const user = await fetchSignInMethodsForEmail(auth, email);

  if (user.length > 0) {
    return next(
      new ErrorHandler(409, "User with that credential already exists.")
    );
  }
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const newUser = userCredential.user;

  if (!newUser) {
    return next(new ErrorHandler(500));
  }

  await updateProfile(newUser, {
    displayName: `${firstName}#${lastName}#${phone}#11S@001Kl1L8d%99457aAl2305=`,
  });

  res.status(200).json({
    success: true,
    message: "User Create successfully",
  });
});

exports.loginAdmin = trycatch(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const e = errors.mapped();
    return next(
      new ErrorHandler(
        400,
        `${e.email ? e.email.msg : ""}\n${e.password ? e.password.msg : ""}`
      )
    );
  }

  const { email, password } = await req.body;

  const user = await fetchSignInMethodsForEmail(auth, email);
  if (user.length <= 0) {
    return next(new ErrorHandler(404, "Not Found: User not found"));
  }
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const loggedUser = await userCredential.user;
  if (!loggedUser) {
    return next(new ErrorHandler(500));
  }
  const info = loggedUser.displayName.split("#");
  if (info[3] !== "11S@001Kl1L8d%99457aAl2305=") {
    return next(new ErrorHandler(401));
  }
  req.session.user = {
    act: loggedUser.accessToken,
    uid: loggedUser.uid,
    email: loggedUser.email,
    name: info[0] + info[1],
    phone: info[2],
    role: info[3],
    creationTime: loggedUser.metadata.creationTime,
  };
  res.status(200).json({
    success: true,
    message: "Login successful!",
  });
});
exports.dashboardAdmin = trycatch(async (req, res, next) => {
  const balance = await readMyBalance();
  const refunds = await refundedBalance();
  const orders = await totalOrders();
  const users = await getTotalUser();
  if (!balance || refunds < 0) {
    return next(new ErrorHandler(500));
  }
  res.render("index", {
    page: "dashboard",
    title: "Dashboard",
    balance: balance,
    refund: refunds,
    orders: orders,
    users: users,
  });
});

exports.settingsAdmin = trycatch(async (req, res, next) => {
  res.render("index", { page: "settings", title: "Settings" });
});

exports.orderAdmin = trycatch(async (req, res) => {
  const data = await readPayments();
  const metadata = await readTracks();
  if (!data || !metadata) {
    return next(new ErrorHandler(500));
  }

  res.render("index", {
    page: "order",
    title: "Order",
    data: data,
    metadata: metadata,
    token: req.csrfToken(true),
  });
});

exports.getUserAdmin = trycatch(async (req, res) => {
  const userRecords = await admin.auth().listUsers();
  const userList = userRecords.users.map((user) => user.providerData);
  res.render("index", { page: "user", title: "Users", users: userList });
});

exports.profileAdmin = trycatch(async (req, res) => {
  const user = await req.session.user;
  getUserLogs(user.uid, (userLogs) => {
    res.render("index", {
      page: "profile",
      title: "Profile",
      logs: userLogs,
      id: user.uid,
      user: user,
    });
  });
});

exports.menuAdmin = trycatch(async (req, res) => {
  res.render("index", {
    page: "menu",
    title: "Create",
    token: req.csrfToken(true),
  });
});

exports.getMenuAdmin = trycatch(async (req, res) => {
  const menus = await getDocs(collection(db, "menu"));
  const menuArray = menus.docs.map((doc) => {
    const menuItem = doc.data();
    menuItem.id = doc.id;
    return menuItem;
  });

  if (menuArray.length < 1) {
    return next(new ErrorHandler(500));
  }

  res.render("index", {
    page: "getMenu",
    title: "Menu",
    menu: menuArray,
    token: req.csrfToken(true),
  });
});

exports.getRefundRequests = trycatch(async (req, res, next) => {
  const refunds = await getDocs(collection(db, "refundRequest"));
  const refundArray = refunds.docs.map((doc) => {
    const refundItem = doc.data();
    refundItem.id = doc.id;
    return refundItem;
  });

  if (refundArray.length < 1) {
    return next(new ErrorHandler(500));
  }
  res.render("refundRequests", {
    page: "refundRequests",
    title: "Requests",
    refund: refundArray,
    token: req.csrfToken(true),
  });
});

exports.logOutAdmin = trycatch(async (req, res, next) => {
  await req.session.destroy();
  await signOut(auth);
  res.redirect("/admin/highlands/cuisine/login");
});

// function
const getTotalUser = async () => {
  const userRecords = await admin.auth().listUsers();
  const userLength = userRecords.users.length;
  return userLength;
};
