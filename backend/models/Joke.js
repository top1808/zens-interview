const mongoose = require("mongoose");

const JokeSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    funnyRate: {
      type: Number,
    },
    notFunnyRate: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Joke", JokeSchema);
