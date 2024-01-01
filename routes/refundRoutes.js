const express = require("express");
const { upload } = require("../helpers/multer");
const { refundCreate } = require("../controller/refundController");
const router = express.Router();

router.post("/create", upload.single("image"), refundCreate);

module.exports = router;
