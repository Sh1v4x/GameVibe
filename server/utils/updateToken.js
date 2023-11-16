const jwt = require("jsonwebtoken");

module.exports = (res, tokenData) => {
  const token = jwt.sign(tokenData, process.env.jwt_secret);

  cookie = res.cookie("jwt_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: new Date(Date.now() + 24 * 60 * 60 * 1000),
    path: "/",
  });

  res.send();
};
