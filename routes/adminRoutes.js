const express = require("express");
const { deleteLog } = require("../helpers/userLog");
const { isAuthenticated } = require("../middleware/checkAuth");
const {
  dashboardAdmin,
  settingsAdmin,
  orderAdmin,
  getUserAdmin,
  loginAdmin,
  profileAdmin,
  menuAdmin,
  getMenuAdmin,
  signupAdmin,
  getRefundRequests,
  loginPage,
  logOutAdmin,
} = require("../controller/adminController");
const {
  userLoginValidator,
  userRegisterValidator,
} = require("../validations/validations");
const { logger } = require("../helpers/logger");

const router = express.Router();

router.get("/login", loginPage);

router.get("/logout", logOutAdmin);

router.post("/login", userLoginValidator, loginAdmin);

router.post("/register", userRegisterValidator, signupAdmin);

router.get("/", isAuthenticated, logger("Viewed Dashboard"), dashboardAdmin);

router.get(
  "/setting",
  isAuthenticated,
  logger("Viewed Settings"),
  settingsAdmin
);

router.get("/orders", logger("Viewed Orders"), orderAdmin);

router.get("/users", isAuthenticated, logger("Viewed Users"), getUserAdmin);

router.get("/profile", isAuthenticated, logger("Viewed Profile"), profileAdmin);

router.get("/delete/log", isAuthenticated, logger("Deleted Logs"), deleteLog);

router.get("/menu", isAuthenticated, logger("Viewed Menu"), menuAdmin);

router.get("/get", isAuthenticated, logger("Dashboard"), getMenuAdmin);

router.get(
  "/refund/requests",

  isAuthenticated,
  logger("Viewed Refunds"),
  getRefundRequests
);

router.get(
  "/change/delivered",
  logger("Changes Delivered status"),
  isAuthenticated
);

module.exports = router;
