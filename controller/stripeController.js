const ejs = require("ejs");
const { trycatch } = require("../helpers/trycatch");
const { ErrorHandler } = require("../helpers/errrorHandling");
const sendEmail = require("../helpers/sendMail");

const {
  trackOrder,
  readOrder,
  perMenuItem,
} = require("../service/databaseServices");
const {
  getCustomerDetails,
  createCustomer,
  createTax,
  createRefund,
  createSession,
} = require("../service/paymentService");

exports.stripePayment = trycatch(async (req, res, next) => {
  const { cartItems, products, email } = await req.body;
  const customer = await createCustomer(email);

  const tax = await createTax();

  if (!customer || !tax) {
    return next(new ErrorHandler(500));
  }
  const line_items = await Promise.all(
    cartItems.map(async (item) => {
      {
        const currentMenu = await perMenuItem(item.menuID);
        const data = await currentMenu.submenu.find(
          (obj) => obj.id === item.subMenu
        );

        const addon =
          item.addonId && data.addons.find((x) => x.id === item.addonId);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.addonId
                ? data.title + "(" + addon.title + ")"
                : data.title,
              metadata: {
                id: item.menuID,
                subid: data.id,
              },
            },
            unit_amount: item.addonId
              ? Math.round(parseInt(data.price) + parseInt(addon.price)) * 100
              : Math.round(data.price) * 100,
          },
          quantity: item.quantity,
          tax_rates: [tax.id],
        };
      }
    })
  );
  const subtotal = line_items.reduce(
    (acc, item) => acc + item.price_data.unit_amount * item.quantity,
    0
  );

  const session = await createSession({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: subtotal < 1500 ? 2500 : 1000,
            currency: "usd",
          },
          display_name: "Expected Hour",
          delivery_estimate: {
            minimum: {
              unit: "hour",
              value: 2,
            },
            maximum: {
              unit: "hour",
              value: 5,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },

    line_items,
    mode: "payment",
    customer: customer.id,
    success_url: `${process.env.BACKEND_URL}/api/v1/payment/verify/pay/${email}/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cart/details`,
  });

  if (!session) {
    return next(ErrorHandler(500));
  }

  const order = await trackOrder(products, session.id, customer.id);

  if (!order) {
    return next(new ErrorHandler(500));
  }
  res.send({ url: session.url });
});

exports.sendEmailPayment = trycatch(async (req, res, next) => {
  const { email, customer } = await req.params;
  const customerDetail = await getCustomerDetails(customer);
  if (!customerDetail) {
    return next(new ErrorHandler(404, "User not found"));
  }

  const products = await readOrder(customer);
  if (!products) {
    return next(
      new ErrorHandler(
        500,
        "Order has been placed but cannot find in database."
      )
    );
  }

  const data = await ejs.renderFile("./views/emails/orderConform.ejs", {
    customerDetail,
    products,
  });
  sendEmail({
    to: "nirdoshlamixane001@gmail.com",
    subject: "Order Placed",
    html: data,
  });
  res.redirect(`${process.env.CLIENT_URL}/checkout-success`);
});

exports.refundPayment = trycatch(async (req, res, next) => {
  const { email, chargeId, refundAmount, refundReason } = await req.body;
  const hasRefunded = await createRefund(chargeId, refundAmount, refundReason);
  if (!hasRefunded) {
    return next(ErrorHandler(500));
  }
  await createRefund(hasRefunded);
  sendEmail({
    to: email,
    subject: "Amount Refunded",
    html: `<div>
    Your Refund Request For Conformation Id: ${chargeId} is successful.
    </div>`,
  });
  res.redirect("/admin/highlands/cuisine/refund/requests");
});
