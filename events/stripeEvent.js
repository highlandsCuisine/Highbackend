"use strict";
const stripe = require("stripe")(process.env.STRIPE_KEY);
const { trycatch } = require("../helpers/trycatch");
const escpos = require("escpos");
escpos.Network = require("escpos-network");
const { createOrder, createIntent } = require("../service/databaseServices");
const {
  readCustomer,
  readIntent,
  readCharges,
} = require("../service/paymentService");

// Stripe webhoook
exports.stripeHook_PaymentCapture = trycatch(async (req, res, next) => {
  const endpointSecret = process.env.STRIPE_WEB_HOOK;
  const sig = req.headers["stripe-signature"];
  let event;
  let data;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    data = event.data.object;
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = await readIntent(data.id);
      const charges = await readCharges(paymentIntent.latest_charge);
      if (charges) {
        const x = await createIntent(paymentIntent, charges);
        if (!x) {
          return res.status(400).json({
            success: false,
            message: "Payment succeed but Failed to track order!",
          });
        }
      }
      break;
    }
    case "checkout.session.completed": {
      try {
        const customer = await readCustomer(data.customer);
        if (customer) {
          const x = await createOrder(customer, data);
          console.log("Printer Code");
          var network = new escpos.Network("192.168.128.72");
          const options = { encoding: "GB18030" };
          const printer = new escpos.Printer(network, options);
          console.log(printer);
          try {
            console.log("Printer Initiated!");
            network.open(function (error, device) {
              printer.font("A").align("ct").style("NORMAL").size(1, 1);
              printer.align("ct");
              printer.print("property- align: 'ct'");
              printer.align("CT");
              printer.print("property- align: 'CT'");
              printer.align("CENTER");
              printer.style("bu");
              printer.print("property- align: 'CENTER' & style: 'bu'");
              printer.style("B");
              printer.print("style: 'B'");
              printer.print("Date: ");
              printer.style("normal");
              printer.print("property- style: 'NORMAL'");
              printer.style("NORMAL");
              printer.println(
                "Dvls highland testing by Nirdosh Lamichhane...."
              );
              printer.println(
                "If printing succeed please leave a comment on MS TEAMS."
              );
              printer.println("Printed By Nirdosh Lamichhane.");
              printer.cut();
              printer.close();
            });
          } catch (e) {
            console.log(e);
          }
          if (!x) {
            return res.status(400).json({
              success: false,
              message: "Payment succeed but Failed to track order!",
            });
          }
          return res.status(200).json({
            success: true,
            message: "Payment succeed!",
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
  res.json({ received: true });
});
