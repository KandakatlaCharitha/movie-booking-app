const db = require("../models");
const Artist = db.artist;

exports.findAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find();

    if (artists.length > 0) {
      res.status(200).json({ artists }); // Send artists in the response if found
    } else {
      res.status(404).json({ msg: "There are no artists." }); // Send 404 if no artists are found
    }
  } catch (error) {
    console.error("Error fetching artists:", error); // Log error for server-side debugging
    res.status(500).json({
      message: "Some error occurred while retrieving artists.", // Send generic error message to client
    });
  }
};
