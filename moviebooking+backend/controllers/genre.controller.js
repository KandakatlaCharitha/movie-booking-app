const db = require("../models");
const Genre = db.genre; // Ensure 'genre' matches the model name exported from 'models/index.js'

exports.findAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find();

    if (genres.length > 0) {
      res.status(200).json({ genres }); // Wrap genres in an object with 'genres' key
    } else {
      res.status(404).json({ msg: "There are no genres." });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      message: error.message || "Some error occurred while retrieving genres.",
    });
  }
};
