const jwt = require("jsonwebtoken");

module.exports = (cookie) => {
  if (!cookie) return new Error("No cookie");

  const strToken = cookie.split("=")[1];
  return jwt.verify(strToken, process.env.JWT_SECRET);
};
