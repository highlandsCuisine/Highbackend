const express = require("express");
const { generateToken } = require("../middleware/csrfMiddleware");
const router = express.Router();

//csrf Route
router.get("/csrf-token", async (req, res) => {
  return res.json({
    token: req.csrfToken(true),
  });
});

module.exports = router;
