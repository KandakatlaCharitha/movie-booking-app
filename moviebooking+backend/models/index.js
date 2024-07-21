const mongoose = require("mongoose");
const dbConfig = require("../config/db.config.js");

// Connect to MongoDB using the URL from the configuration file
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.artist = require("./artist.model.js");
db.genre = require("./genre.model.js");
db.movie = require("./movie.model.js");
db.user = require("./user.model.js");

module.exports = db;
