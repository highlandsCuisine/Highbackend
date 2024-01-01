exports.setCookie = (res, key, value, site, priority, secure) => {
  res.cookie(key, JSON.stringify(value), {
    httpOnly: true,
    secure: secure ? secure : true,
    priority: priority ? priority : "high",
    maxAge: 3540000,
    sameSite: site ? site : "lax",
  });
};
