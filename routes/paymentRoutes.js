const express = require("express");
const {
  stripePayment,
  refundPayment,
  sendEmailPayment,
} = require("../controller/stripeController");
const router = express.Router();

router.post("/create", stripePayment);

router.get("/verify/pay/:email/:customer", sendEmailPayment);

router.get("/verify/pay", sendEmailPayment);

router.post("/secret/78923847834326487sdhsdhkjfjsd/refund", refundPayment);

module.exports = router;
