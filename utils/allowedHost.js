const allowlist = require("../config/acceptingHost");

exports.corsOptionsDelegate = {
  origin: allowlist,
  credentials: true,
};
