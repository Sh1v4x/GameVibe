const express = require("express");
const playlistRouter = express.Router();
const { MongoClient } = require("mongodb");
const GridFSBucket = require("mongodb").GridFSBucket;
const mongoURI = "mongodb://127.0.0.1:27017";
const client = new MongoClient(mongoURI);
const database = "game_vibe";
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const User = require("../models/user.js");
const Playlist = require("../models/playlist.js");
const jwtVerify = require("../utils/jwtVerify.js");
const checkToken = require("../middleware/checkToken.js");
const checkAdminToken = require("../middleware/checkAdminToken.js");
const updateToken = require("../utils/updateToken.js");

playlistRouter.get("/userPlaylist", checkToken, async (req, res) => {
  try {
    const token = jwtVerify(req.headers.cookie);

    const userLikedPlaylist = await Playlist.find({
      id: { $in: token.likedPlaylist },
    });

    if (!userLikedPlaylist) {
      return res.status(404).json({ message: "Playlist non trouvé." });
    }

    res.status(200).json(userLikedPlaylist);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la connexion à MongoDB :",
      error
    );
    res.sendStatus(500);
  }
});

playlistRouter.post("/likedPlaylist", checkToken, async (req, res) => {
  try {
    const token = jwtVerify(req.headers.cookie);
    const { playlistId } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: token.id },
      { $push: { likedPlaylist: playlistId } }
    );
    const updateLikedPlaylist = await User.findOne({ _id: token.id });

    if (!updatedUser || !updateLikedPlaylist) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const tokenData = {
      ...token,
      likedPlaylist: updateLikedPlaylist.likedPlaylist,
    };

    await updateToken(res, tokenData);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la mise à jour des playlists aimées :",
      error
    );
    res.sendStatus(500);
  }
});

playlistRouter.post("/dislikedPlaylist", checkToken, async (req, res) => {
  try {
    const token = jwtVerify(req.headers.cookie);
    const { playlistId } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: token.id },
      { $pull: { likedPlaylist: playlistId } }
    );

    const updateLikedPlaylist = await User.findOne({ _id: token.id });

    if (!updatedUser || !updateLikedPlaylist) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const tokenData = {
      ...token,
      likedPlaylist: updateLikedPlaylist.likedPlaylist,
    };

    await updateToken(res, tokenData);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la mise à jour des playlists aimées :",
      error
    );
    res.sendStatus(500);
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./uploads/`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

playlistRouter.post(
  "/addPlaylist",
  upload.fields([{ name: "image" }, { name: "music" }]),
  checkAdminToken,
  async (req, res) => {
    try {
      const { playlistName } = req.body;
      const imageFile = req.files.image[0];
      const musicFiles = req.files.music;
      if (!imageFile || !musicFiles || musicFiles.length === 0) {
        return res.status(400).json({
          message: "Veuillez sélectionner une image et des fichiers musicaux.",
        });
      }

      const db = client.db(database);
      const bucket = new GridFSBucket(db);

      const existingPlaylist = await Playlist.findOne({
        name: playlistName,
      });

      if (existingPlaylist) {
        return res.status(400).json({
          message: "Une playlist avec ce nom existe déjà.",
        });
      }

      const playlistID = uuidv4();

      const imageFileName = imageFile.originalname;
      const imageUploadStream = fs
        .createReadStream(imageFile.path)
        .pipe(bucket.openUploadStream(imageFileName));
      await new Promise((resolve, reject) => {
        imageUploadStream.on("error", (error) => {
          reject(error);
        });
        imageUploadStream.on("finish", async () => {
          try {
            fs.unlinkSync(imageFile.path);

            const playlist = [];
            for (const musicFile of musicFiles) {
              const musicFileName = musicFile.originalname.replace(".mp3", "");
              const musicUploadStream = fs
                .createReadStream(musicFile.path)
                .pipe(bucket.openUploadStream(musicFileName));
              await new Promise((resolve, reject) => {
                musicUploadStream.on("error", (error) => {
                  reject(error);
                });
                const formattedMusicName = musicFileName
                  .replace(".mp3", "")
                  .replace(/-/g, " ");
                musicUploadStream.on("finish", () => {
                  const musicData = {
                    name: formattedMusicName,
                    msc: {
                      url: `http://localhost:8000/music/${musicFileName}`,
                      id: musicUploadStream.id.toString(),
                    },
                  };
                  playlist.push(musicData);
                  resolve();

                  fs.unlinkSync(musicFile.path);
                });
              });
            }

            const formattedImageName = imageFileName.replace(".jpg", "");
            const gameData = {
              name: playlistName,
              img: {
                url: `http://localhost:8000/img/${formattedImageName}`,
              },
              id: playlistID,
              playlist,
            };

            await Playlist.create({
              ...gameData,
            });

            res
              .status(200)
              .json({ message: "Nouvelle playlist ajoutée avec succès." });
          } catch (error) {
            console.error(
              "Une erreur s'est produite lors de l'ajout de la playlist :",
              error
            );
            res
              .status(500)
              .json({ message: "Erreur lors de l'ajout de la playlist." });
          }
        });
      });
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de l'ajout de la playlist :",
        error
      );
      res
        .status(500)
        .json({ message: "Erreur lors de l'ajout de la playlist." });
    }
  }
);

playlistRouter.delete(
  "/deletePlaylist/:playlistID",
  checkAdminToken,
  async (req, res) => {
    try {
      const { playlistID } = req.params;

      const deletedPlaylist = await Playlist.findOneAndDelete({
        _id: playlistID,
      });

      if (deletedPlaylist) {
        res.status(200).json({ message: "Playlist supprimée avec succès." });
      } else {
        res.status(404).json({ message: "Playlist non trouvée." });
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression de la playlist :",
        error
      );
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression de la playlist." });
    }
  }
);

playlistRouter.put(
  "/updatePlaylist/:playlistID",
  checkAdminToken,
  async (req, res) => {
    try {
      const playlistID = req.params.playlistID;
      const { name } = req.body;

      const updatedPlaylist = await Playlist.findOneAndUpdate(
        { _id: playlistID },
        { name: name }
      );

      if (updatedPlaylist) {
        return res
          .status(200)
          .json({ message: "Playlist renommée avec succès." });
      } else {
        return res.status(404).json({ message: "Playlist non trouvée." });
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors du renommage de la playlist :",
        error
      );
      res
        .status(500)
        .json({ message: "Erreur lors du renommage de la playlist." });
    }
  }
);

playlistRouter.put(
  "/updatePlaylistImage/:playlistID",
  upload.single("image"),
  checkAdminToken,
  async (req, res) => {
    try {
      const { playlistID } = req.params;
      const imageFile = req.file;

      if (!imageFile) {
        return res.status(400).json({
          message: "Veuillez sélectionner une image.",
        });
      }

      const db = client.db(database);
      const bucket = new GridFSBucket(db);

      const existingPlaylist = await Playlist.findOne({
        id: playlistID,
      });

      if (!existingPlaylist) {
        return res.status(404).json({
          message: "Playlist non trouvée.",
        });
      }

      const imageFileName = imageFile.originalname;
      const imageUploadStream = fs
        .createReadStream(imageFile.path)
        .pipe(bucket.openUploadStream(imageFileName));

      await new Promise((resolve, reject) => {
        imageUploadStream.on("error", (error) => {
          reject(error);
        });
        imageUploadStream.on("finish", async () => {
          try {
            fs.unlinkSync(imageFile.path);

            const formattedImageName = imageFileName.replace(".jpg", "");

            await Playlist.findOneAndUpdate(
              { id: playlistID },
              { "img.url": `http://localhost:8000/img/${formattedImageName}` }
            );

            res.status(200).json({
              message: "Image de la playlist mise à jour avec succès.",
            });
          } catch (error) {
            console.error(
              "Une erreur s'est produite lors de la mise à jour de l'image de la playlist :",
              error
            );
            res.status(500).json({
              message:
                "Erreur lors de la mise à jour de l'image de la playlist.",
            });
          }
        });
      });
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la mise à jour de l'image de la playlist :",
        error
      );
      res.status(500).json({
        message: "Erreur lors de la mise à jour de l'image de la playlist.",
      });
    }
  }
);

module.exports = playlistRouter;
