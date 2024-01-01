const stripe = require("stripe")(process.env.STRIPE_KEY);

//create stripe customer
exports.createCustomer = async (email) => {
  const customer = await stripe.customers.create({
    email: email,
    metadata: {
      userId: email,
    },
  });
  return customer;
};
//create Session
exports.createSession = async (data) => {
  const session = await stripe.checkout.sessions.create(data);
  return session;
};
// create tax (8.85%)
exports.createTax = async () => {
  const tax = await stripe.taxRates.create({
    display_name: "Tax",
    inclusive: false,
    percentage: 8.85,
  });
  return tax;
};
//create refund
exports.createRefund = async (chargeId, refundAmount, refundReason) => {
  const refund = await stripe.refunds.create({
    charge: chargeId,
    amount: refundAmount * 100,
    reason: refundReason,
  });
  return refund;
};
// retrieve customer details
exports.readCustomer = async (id) => {
  const customer = await stripe.customers.retrieve(id);
  return customer;
};
// retrieve session details requires sessionID
exports.readSession = async (id) => {
  const session = await stripe.checkout.sessions.retrieve(id);
  return session;
};
// retrieve charges for given charge id
exports.readCharges = async (chargeID) => {
  const charges = await stripe.charges.retrieve(chargeID);
  return charges;
};
// retrieve intent details for given intent id
exports.readIntent = async (id) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(id);
  return paymentIntent;
};
// retrieves all charges that occured in given stripe account
exports.readPayments = async () => {
  const data = await stripe.charges.list({ limit: 300 });
  return data;
};
// retrieve stripe current balance
exports.readMyBalance = async () => {
  const data = await stripe.balance.retrieve();
  return data;
};
// refunded data
exports.refundedBalance = async () => {
  const data = await stripe.refunds.list();
  const refunds = data.data;

  const totalRefundBalance = refunds.reduce(
    (accumulator, refund) => accumulator + refund.amount,
    0
  );

  return totalRefundBalance;
};
// get all details
exports.getCustomerDetails = async (id) => {
  const customer = await this.readSession(id);
  const paymentIntent = await this.readIntent(customer.payment_intent);
  const charges = await this.readCharges(paymentIntent.latest_charge);
  return {
    customer: customer,
    intent: paymentIntent,
    charge: charges,
  };
};
