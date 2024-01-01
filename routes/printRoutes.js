const express = require("express");
const {
  htmltopdf,
  htmltopdfKitchen,
  thermalPrinting,
} = require("../controller/printController");
const router = express.Router();

router.post("/generatepdf", htmltopdf);
router.get("/generatepdf/print", thermalPrinting);
router.post("/generatepdf/kitchen", htmltopdfKitchen);

module.exports = router;
