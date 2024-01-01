const { getDoc, addDoc, collection } = require("firebase/firestore");
const { ErrorHandler } = require("../helpers/errrorHandling");
const { trycatch } = require("../helpers/trycatch");
const { db } = require("../database/firebase");

exports.refundCreate = trycatch(async (req, res, next) => {
  let imageUrl = "";
  const fileName = await req.file.filename;
  if (fileName) {
    imageUrl = `http://localhost:5000/uploads/${fileName}`;
  }

  const { chargeId, refundDescription, refundReason, orderEmail } = req.body;
  const storeRefund = {
    chargeId,
    refundDescription,
    refundReason,
    imageUrl,
    orderEmail,
  };

  const refundRef = collection(db, "refundRequest");

  const addedrefundRef = await addDoc(refundRef, storeRefund);
  const addedRefunDoc = await getDoc(addedrefundRef);

  if (!addedRefunDoc.exists()) {
    return next(new ErrorHandler(500, "Failed to create refund."));
  }
  res.status(200).json({
    success: true,
    message: "Refund Requested",
  });
});
