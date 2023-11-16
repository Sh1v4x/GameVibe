const jwtVerify = require("../utils/jwtVerify");

function checkAdminToken(req, res, next) {
  const token = req.headers.cookie;

  const decodedToken = jwtVerify(token);

  if (!decodedToken || !decodedToken.isAdmin) {
    return res.status(401).json({ message: "Token invalide." });
  }

  next();
}

module.exports = checkAdminToken;
