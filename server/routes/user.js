const express = require("express");
const userRouter = express.Router();
const User = require("../models/user.js");
const checkToken = require("../middleware/checkToken.js");
const jwtVerify = require("../utils/jwtVerify.js");
const updateToken = require("../utils/updateToken.js");

userRouter.get("/getUserData", checkToken, async (req, res) => {
  try {
    const { id } = jwtVerify(req.headers.cookie);
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const userData = {
      id: user._id,
      email: user.email,
      username: user.username,
      likedPlaylist: user.likedPlaylist,
      likedSong: user.likedSong,
      isAdmin: user.isAdmin,
      language: user.language ? user.language : "en",
    };
    res.status(200).json({ userData });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des données utilisateur :",
      error
    );
    res.sendStatus(500);
  }
});

userRouter.get("/updateToken", checkToken, async (req, res) => {
  try {
    const { id } = jwtVerify(req.headers.cookie);
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const userData = {
      id: user._id,
      email: user.email,
      username: user.username,
      likedPlaylist: user.likedPlaylist,
      likedSong: user.likedSong,
      isAdmin: user.isAdmin,
      language: user.language ? user.language : "en",
    };

    updateToken(res, userData);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des données utilisateur :",
      error
    );
    res.sendStatus(500);
  }
});

userRouter.put("/updateLanguage", checkToken, async (req, res) => {
  try {
    const { id } = jwtVerify(req.headers.cookie);
    const { language } = req.body;

    if (!language) {
      return res
        .status(400)
        .json({ message: "La nouvelle langue est requise." });
    }

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    user.language = language;
    await user.save();

    const userData = {
      id: user._id,
      email: user.email,
      username: user.username,
      likedPlaylist: user.likedPlaylist,
      likedSong: user.likedSong,
      isAdmin: user.isAdmin,
      language: language,
    };

    updateToken(res, userData);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la mise à jour de la langue :",
      error
    );
    res.sendStatus(500);
  }
});

userRouter.put("/updateUsername", checkToken, async (req, res) => {
  try {
    const { id } = jwtVerify(req.headers.cookie);
    const { username } = req.body;

    if (!username) {
      return res
        .status(400)
        .json({ message: "Le nouveau nom d'utilisateur est requis." });
    }

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    user.username = username;
    await user.save();

    const userData = {
      id: user._id,
      email: user.email,
      username: username,
      likedPlaylist: user.likedPlaylist,
      likedSong: user.likedSong,
      isAdmin: user.isAdmin,
      language: user.language ? user.language : "en",
    };

    updateToken(res, userData);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la mise à jour du nom d'utilisateur :",
      error
    );
    res.sendStatus(500);
  }
});

module.exports = userRouter;
