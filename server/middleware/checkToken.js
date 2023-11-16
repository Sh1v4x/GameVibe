function checkToken(req, res, next) {
  const token = req.headers.cookie;

  if (!token || !token.includes("jwt_token")) {
    return res
      .status(401)
      .json({ message: "Token manquant. L'utilisateur n'est pas connecté." });
  }

  next();
}

module.exports = checkToken;
