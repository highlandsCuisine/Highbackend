const express = require("express");
const { isAuthenticated } = require("../middleware/checkAuth");
const {
  createMenu,
  getMenu,
  updateMenu,
  createAddons,
  createSubMenu,
} = require("../controller/menuController");
const {
  categoryValidator,
  subMenuValidator,
  addonsValidator,
} = require("../validations/validations");

const router = express.Router();

router.get("/get", getMenu);

router.post("/create", isAuthenticated, categoryValidator, createMenu);

router.post(
  "/create/submenu",
  isAuthenticated,
  subMenuValidator,
  createSubMenu
);

router.patch("/update/:id", isAuthenticated, updateMenu);

router.post("/create/addons", isAuthenticated, addonsValidator, createAddons);

module.exports = router;
