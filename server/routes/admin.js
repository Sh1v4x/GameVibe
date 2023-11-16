const express = require("express");
const adminRouter = express.Router();
const jwt = require("jsonwebtoken");
const Playlist = require("../models/playlist");
const checkAdminToken = require("../middleware/checkAdminToken");

adminRouter.get("/getAdminData", checkAdminToken, async (req, res) => {
  const token = req.headers.cookie.split("=")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.jwt_secret, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (err || decoded.isAdmin === false) {
      return res.status(401).json({ authorized: false, redirectTo: "/" });
    }

    const playlist = await Playlist.find({});
    res.status(200).json({ authorized: true, playlist });
  });
});

module.exports = adminRouter;
