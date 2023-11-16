const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      url: {
        type: String,
        required: true,
      },
    },
    id: {
      type: String,
      required: true,
    },
    playlist: [
      {
        _id: false,
        name: {
          type: String,
          required: true,
        },
        msc: {
          url: {
            type: String,
            required: true,
          },
          id: {
            type: String,
            required: true,
          },
        },
      },
    ],
  },
  { collection: "playlist", versionKey: false }
);

module.exports = mongoose.model("playlist", playlistSchema);
