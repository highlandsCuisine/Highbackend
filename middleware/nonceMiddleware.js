const crypto = require("crypto");

exports.generateNonce = () => {
  const nonce = crypto.randomBytes(16).toString("base64");
  return nonce;
};
