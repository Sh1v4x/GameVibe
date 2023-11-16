const mongoose = require("mongoose");

const userSchemae = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    likedPlaylist: {
      type: Array,
      required: false,
    },
    likedSong: {
      type: Array,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
  },
  {
    collection: "user",
  }
);

module.exports = mongoose.model("User", userSchemae);
