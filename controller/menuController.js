const { v4: uuidv4 } = require("uuid");
const { ErrorHandler } = require("../helpers/errrorHandling");
const { trycatch } = require("../helpers/trycatch");
const { validationResult } = require("express-validator");
const {
  readHighlandMenu,
  createHighlandMenu,
  updateHighlandMenu,
  createHighlandSubMenu,
  createHighlandSubMenuAddon,
} = require("../service/databaseServices");

exports.createMenu = trycatch(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(({ msg }) => msg);
    return res.status(400).json({
      page: "menu",
      title: "Menu",
      errors: errorMessages,
    });
  }
  const { title, desc } = req.body;
  const storeMenu = {
    title,
    desc,
    submenu: [],
  };
  const addedMenuDoc = await createHighlandMenu("menu", storeMenu);

  if (!addedMenuDoc.exists()) {
    throw new ErrorHandler(500, "Failed to create menu.");
  }
  res.redirect("/admin/highlands/cuisine/menu");
});

exports.getMenu = trycatch(async (req, res, next) => {
  const menuArray = await readHighlandMenu("menu");
  if (menuArray.length < 1) {
    return next(new ErrorHandler(500));
  }
  res.status(200).json({
    success: true,
    message: "Menu fetched successfully",
    data: menuArray,
  });
});

exports.updateMenu = trycatch(async (req, res, next) => {
  const id = req.params.id;
  const data = await req.body;
  const menu = await updateHighlandMenu("menu", id, data);
  if (!menu) {
    return next(new ErrorHandler(500));
  }
  res.status(200).json({
    success: true,
    message: "Menu Updated Successfully",
    data: data,
  });
});

exports.createSubMenu = trycatch(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(({ msg }) => msg);
    return res.status(400).json({
      page: "menu",
      title: "Menu",
      errors: errorMessages,
    });
  }
  const { title, desc, price, id } = req.body;
  const menuId = uuidv4();
  const data = {
    id: menuId,
    title: title,
    desc: desc,
    price: price,
    addons: [],
  };

  const menuRef = await createHighlandSubMenu("menu", id, data);
  if (!menuRef) {
    return next(new ErrorHandler(500));
  }

  res.redirect("/admin/highlands/cuisine/get");
});

exports.createAddons = trycatch(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(({ msg }) => msg);
    return res.status(400).json({
      page: "menu",
      title: "Menu",
      errors: errorMessages,
    });
  }
  const { title, price, ids, id } = req.body;
  const addonId = uuidv4();
  const data = {
    title: title,
    price: price,
    id: addonId,
  };
  const addonRef = await createHighlandSubMenuAddon("menu", id, ids, data);
  if (addonRef) {
    res.redirect("/admin/highlands/cuisine/get");
  } else {
    return next(new ErrorHandler(404, "Submenu item not found"));
  }
});

exports.readTracks = async () => {
  try {
    const orderArray = await readHighlandMenu("trackOrder");
    if (orderArray.length < 1) {
      return null;
    }
    return orderArray;
  } catch (err) {
    return null;
  }
};
