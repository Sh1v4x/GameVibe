const express = require("express");
const songsRouter = express.Router();
const User = require("../models/user.js");
const checkToken = require("../middleware/checkToken.js");
const jwtVerify = require("../utils/jwtVerify.js");
const Playlist = require("../models/playlist.js");
const GridFSBucket = require("mongodb").GridFSBucket;
const { MongoClient } = require("mongodb");
const mongoURI = "mongodb://127.0.0.1:27017";
const database = "game_vibe";
const client = new MongoClient(mongoURI);
const updateToken = require("../utils/updateToken.js");
const checkAdminToken = require("../middleware/checkAdminToken.js");
const multer = require("multer");
const fs = require("fs");

songsRouter.get("/userSongs", checkToken, async (req, res) => {
  try {
    const token = jwtVerify(req.headers.cookie);

    const playlists = await Playlist.find({
      "playlist.msc.id": { $in: token.likedSong },
    });

    if (!playlists) {
      return res.status(404).json({ message: "Playlist non trouvé." });
    }

    res.status(200).json(playlists);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la connexion à MongoDB :",
      error
    );
    res.sendStatus(500);
  }
});

songsRouter.post("/onLikeSong", checkToken, async (req, res) => {
  try {
    const token = jwtVerify(req.headers.cookie);
    const { songId } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: token.id },
      {
        $push: { likedSong: songId },
      }
    );
    const updateLikedSong = await User.findOne({ _id: token.id });

    if (!updatedUser || !updateLikedSong) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    const tokenData = {
      ...token,
      likedSong: updateLikedSong.likedSong,
    };

    await updateToken(res, tokenData);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de l'ajout de la chanson aimée :",
      error
    );
    res.sendStatus(500);
  }
});

songsRouter.post("/onDislikeSong", checkToken, async (req, res) => {
  try {
    const token = jwtVerify(req.headers.cookie);
    const { songId } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: token.id },
      { $pull: { likedSong: songId } }
    );

    const updateLikedSong = await User.findOne({ _id: token.id });

    if (!updatedUser || !updateLikedSong) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const tokenData = {
      ...token,
      likedSong: updateLikedSong.likedSong,
    };

    await updateToken(res, tokenData);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de l'ajout de la chanson non aimée :",
      error
    );
    res.sendStatus(500);
  }
});

songsRouter.delete("/deleteSong/:songID", checkAdminToken, async (req, res) => {
  try {
    const songID = req.params.songID;

    const updatedPlaylist = await Playlist.findOneAndUpdate(
      { "playlist.msc.id": songID },
      { $pull: { playlist: { "msc.id": songID } } },
      { new: true }
    );

    if (updatedPlaylist) {
      return res
        .status(200)
        .json({ message: "Chanson supprimée avec succès." });
    } else {
      return res.status(404).json({ message: "Chanson non trouvée." });
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la suppression de la chanson :",
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la chanson." });
  }
});

songsRouter.put("/updateSong/:songID", checkAdminToken, async (req, res) => {
  try {
    const songID = req.params.songID;
    const { name } = req.body;

    console.log(songID, name);

    const updatedPlaylist = await Playlist.findOneAndUpdate(
      { "playlist.msc.id": songID },
      { $set: { "playlist.$.name": name } },
      { new: true }
    );

    if (updatedPlaylist) {
      return res.status(200).json({
        message: "Nom de la chanson modifié avec succès.",
        playlist: updatedPlaylist,
      });
    } else {
      return res.status(404).json({ message: "Chanson non trouvée." });
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la modification du nom de la chanson :",
      error
    );
    res.status(500).json({
      message: "Erreur lors de la modification du nom de la chanson.",
    });
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

songsRouter.post(
  "/addMusicToPlaylist/:playlistId",
  upload.single("music"),
  checkAdminToken,
  async (req, res) => {
    try {
      const playlistId = req.params.playlistId;
      const musicFile = req.file;

      if (!musicFile) {
        return res.status(400).json({
          message: "Veuillez sélectionner un fichier musical.",
        });
      }

      const db = client.db(database);
      const bucket = new GridFSBucket(db);

      const existingPlaylist = await Playlist.findOne({
        id: playlistId,
      });

      if (!existingPlaylist) {
        return res.status(400).json({
          message: "Aucune playlist avec cet ID n'a été trouvée.",
        });
      }

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

          existingPlaylist.playlist.push(musicData);

          existingPlaylist
            .save()
            .then(() => {
              fs.unlinkSync(musicFile.path);
              res.status(200).json({
                message: "Musique ajoutée à la playlist avec succès.",
              });
            })
            .catch((err) => {
              console.error(
                "Une erreur s'est produite lors de l'ajout de la musique à la playlist :",
                err
              );
              res.status(500).json({
                message: "Erreur lors de l'ajout de la musique à la playlist.",
              });
            });
        });
      });
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de l'ajout de la musique à la playlist :",
        error
      );
      res.status(500).json({
        message: "Erreur lors de l'ajout de la musique à la playlist.",
      });
    }
  }
);

module.exports = songsRouter;
