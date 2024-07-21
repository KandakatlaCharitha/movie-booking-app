const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  genreid: { type: Number, required: true, unique: true },
  genre: { type: String, required: true },
});

const Genre = mongoose.model("Genre", genreSchema);

module.exports = Genre;
