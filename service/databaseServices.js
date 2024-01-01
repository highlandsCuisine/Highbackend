const {
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
} = require("firebase/firestore");
const { db } = require("../database/firebase");

// Total Sections:
// 1. Menu
// 2. Orders
// 3. Intent
// 4. Refund

// Menu Section //
// create Menu
exports.createHighlandMenu = async (docName, menu) => {
  const menuRef = collection(db, docName);
  const addedMenuRef = await addDoc(menuRef, menu);
  const addedMenuDoc = await getDoc(addedMenuRef);
  return addedMenuDoc;
};

// create Sub Menu
exports.createHighlandSubMenu = async (docName, id, data) => {
  const menuRef = doc(collection(db, docName), id);
  const menuSnapshot = await getDoc(menuRef);
  const currentMenu = menuSnapshot.data();
  currentMenu.submenu.push(data);
  await setDoc(menuRef, currentMenu);
  return currentMenu;
};

//create Addon Menu
exports.createHighlandSubMenuAddon = async (docName, id, ids, data) => {
  const menuRef = doc(collection(db, docName), id);
  const menuSnapshot = await getDoc(menuRef);
  const currentMenu = menuSnapshot.data();
  const submenuIndex = currentMenu.submenu.findIndex(
    (submenuItem) => submenuItem.id === ids
  );
  if (submenuIndex !== -1) {
    currentMenu.submenu[submenuIndex].addons.push(data);
    await setDoc(menuRef, currentMenu);
    return true;
  } else {
    return false;
  }
};

//read Menu
exports.readHighlandMenu = async (docName) => {
  const menus = await getDocs(collection(db, docName));
  const menuArray = menus.docs.map((doc) => {
    const menuItem = doc.data();
    menuItem.id = doc.id;
    return menuItem;
  });
  return menuArray;
};

//update Menu
exports.updateHighlandMenu = async (docName, id, data) => {
  const menu = await doc(collection(db, docName), id);
  if (!menu) {
    return next(new ErrorHandler(500));
  }
  await updateDoc(menu, data);
};

//read per menu Item
exports.perMenuItem = async (id) => {
  const orderRef = await doc(collection(db, "menu"), id);
  const menuSnapshot = await getDoc(orderRef);
  const currentMenu = menuSnapshot.data();
  return currentMenu;
};

// Order Section //
exports.totalOrders = async () => {
  const orders = await getDocs(collection(db, "order"));
  const orderLength = orders.docs.length;
  return orderLength;
};

exports.trackOrder = async (data, id, cid) => {
  try {
    const orderRef = collection(db, "trackOrder");
    const delivered = false;
    await setDoc(doc(orderRef, id), { data, cid, delivered });
    return true;
  } catch (err) {
    return false;
  }
};

exports.readOrder = async (id) => {
  const orderRef = doc(db, "trackOrder", id);
  const orderDoc = await getDoc(orderRef);

  if (orderDoc.exists()) {
    return orderDoc.data();
  } else {
    return null;
  }
};

exports.createOrder = async (customer, data) => {
  try {
    const cartData = (await customer.metadata.userId)
      ? await customer.metadata.userId
      : "undefined";

    const orderRef = collection(db, "order");
    const storeOrder = {
      UID: customer.metadata.userId
        ? await customer.metadata.userId
        : "undefined",
      stripe_UID: data.customer,
      paymentIntent_ID: data.payment_intent,
      subtotal: data.amount_subtotal,
      total: data.amount_total,
      shipping: data.shipping_details,
      shipping_cost: data.shipping_options,
      detailed_cost: data.shipping_options,
      isComplete: data.status,
      payment_status: data.payment_status,
      cartId: cartData,
    };
    const addedorderRef = await addDoc(orderRef, storeOrder);
    const addedMenuDoc = await getDoc(addedorderRef);
    if (!addedMenuDoc.exists()) {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
// Intent Section //
exports.createIntent = async (data, charge) => {
  try {
    const orderRef = collection(db, "intent");
    const storeOrder = {
      stripe_UID: data.customer,
      currency: data.currency,
      latest_charge: data.latest_charge,
      paymentIntent_ID: data.id,
      amount: data.amount,
      received_amount: data.amount_received,
      payment_method: data.payment_method_types,
      shipping: data.shipping,
      detailed_cost: data.shipping,
      isComplete: data.status,
      last4: charge.payment_method_details.card.last4,
      receipt_url: charge.receipt_url,
      charge_status: charge.status,
      card_charge_amount: charge.payment_method_details.card.amount_authorized,
      card_brand: charge.payment_method_details.card.brand,
      charge_payment_intent: charge.payment_intent,
      charge_livemode: charge.livemode,
      charge_failure: charge.failure_balance_transaction,
      balance_transaction: charge.balance_transaction,
      charge_outcomes: charge.outcome,
      charge_isPaid: charge.paid,
    };
    const addedorderRef = await addDoc(orderRef, storeOrder);
    const addedMenuDoc = await getDoc(addedorderRef);

    if (!addedMenuDoc.exists()) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};

// Refund Section //

exports.createRefund = async (data) => {
  try {
    const refundRef = collection(db, "refunded");
    const storeRefund = {
      refund_id: data.id,
      refunded_amount: data.amount,
      balance_transaction: data.balance_transaction,
      charge_id: data.charge,
      createdAt: data.created,
      reason: data.reason,
      intent_ID: data.payment_intent,
      metadata: data.metadata,
    };
    const addedrefundRef = await addDoc(refundRef, storeRefund);
    const addedRefundDoc = await getDoc(addedrefundRef);

    if (!addedRefundDoc.exists()) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};
