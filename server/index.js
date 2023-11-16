const mongoose = require("mongoose");
const mongoURI = "mongodb://127.0.0.1:27017/game_vibe";
const express = require("express");
const readline = require("readline");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const mediaRouter = require("./routes/media");
const songsRouter = require("./routes/songs");
const playlistRouter = require("./routes/playlist");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("Erreur de connexion à MongoDB :", err);
});

db.once("open", () => {
  console.log("Connexion réussie à MongoDB");
});

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  authRouter,
  mediaRouter,
  songsRouter,
  playlistRouter,
  userRouter,
  adminRouter
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (input) => {
  switch (input) {
    case "/upload":
      upload();
      break;
    case "/clear":
      clearDatabase();
      break;
    default:
      console.log("Commande inconnue");
      break;
  }
});

const port = 8000;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
