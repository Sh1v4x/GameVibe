const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../models/user.js");
const updateToken = require("../utils/updateToken.js");
const checkToken = require("../middleware/checkToken.js");
const jwtVerify = require("../utils/jwtVerify.js");

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Adresse e-mail non valide" });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur de comparaison de mot de passe" });
      }

      if (!result) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      tokenData = {
        id: user._id,
        username: user.username,
        email: user.email,
        likedPlaylist: user.likedPlaylist,
        likedSong: user.likedSong,
        isAdmin: user.isAdmin,
        language: user.language,
      };

      updateToken(res, tokenData);
    });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la connexion à MongoDB :",
      error
    );
    res.sendStatus(500);
  }
});

authRouter.get("/logout", async (req, res) => {
  try {
    res.clearCookie("jwt_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      path: "/",
    });
    res.send();
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la connexion à MongoDB :",
      error
    );
    res.sendStatus(500);
  }
});

authRouter.post("/signup", async (req, res) => {
  try {
    const { username, email, password, repeatPassword } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(409).json({ message: "Email non valide" });
    }

    if (password !== repeatPassword) {
      return res
        .status(409)
        .json({ message: "Les mots de passe ne correspondent pas" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res
        .status(409)
        .json({ message: "Ce nom d'utilisateur est déjà utilisé" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Cet e-mail est déjà utilisé" });
    }

    const newUser = {
      username,
      email,
      password: bcrypt.hashSync(password, 10),
      likedPlaylist: [],
      likedSong: [],
      isAdmin: false,
      language: "en",
    };

    await User.create(newUser);

    await updateToken(res, newUser);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la connexion à MongoDB :",
      error
    );
    res.sendStatus(500);
  }
});

authRouter.delete("/deleteAccount", checkToken, async (req, res) => {
  try {
    const { id } = jwtVerify(req.headers.cookie);

    await User.deleteOne({ _id: id });

    res.clearCookie("jwt_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      path: "/",
    });
    res.send();
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la connexion à MongoDB :",
      error
    );
    res.sendStatus(500);
  }
});

module.exports = authRouter;
