const express = require("express");
const { stripeHook_PaymentCapture } = require("../events/stripeEvent");
const router = express.Router();

router.post("/webhook", stripeHook_PaymentCapture);

module.exports = router;
