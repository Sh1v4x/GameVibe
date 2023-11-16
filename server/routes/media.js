const express = require("express");
const mediaRouter = express.Router();
const { MongoClient } = require("mongodb");
const GridFSBucket = require("mongodb").GridFSBucket;
const sharp = require("sharp");
const mongoURI = "mongodb://127.0.0.1:27017";
const client = new MongoClient(mongoURI);
const database = "game_vibe";
const dotenv = require("dotenv");
const Playlist = require("../models/playlist.js");
dotenv.config();


mediaRouter.get("/img/:filename", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(database);
    const bucket = new GridFSBucket(db);
    const fileName = req.params.filename + ".jpg";
    const downloadStream = bucket.openDownloadStreamByName(fileName);

    const resizedImageStream = downloadStream.pipe(sharp().resize(800, 600));

    res.set("content-type", "image/jpeg");
    res.set("accept-ranges", "bytes");
    resizedImageStream.pipe(res);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la connexion à MongoDB :",
      error
    );
    res.sendStatus(500);
  }
});

mediaRouter.get("/music/:filename", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(database);
    const bucket = new GridFSBucket(db);
    const fileName = req.params.filename + ".mp3";
    const downloadStream = bucket.openDownloadStreamByName(fileName);
    res.set("content-type", "audio/mp3");
    res.set("accept-ranges", "bytes");
    downloadStream.pipe(res);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la connexion à MongoDB :",
      error
    );
    res.sendStatus(500);
  }
});

mediaRouter.get("/getData", async (req, res) => {
  try {
    const playlist = await Playlist.find();
    res.send(playlist);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la connexion à MongoDB :",
      error
    );
    res.sendStatus(500);
  }
});

module.exports = mediaRouter;
