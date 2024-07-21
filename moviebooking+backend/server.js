const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const artistRoutes = require("./routes/artist.routes");
const genreRoutes = require("./routes/genre.routes");
const movieRoutes = require("./routes/movie.routes");
const userRoutes = require("./routes/user.routes");

// Middleware setup
app.use(cors());
app.use(express.json());
// bodyParser is used so that frontend data can be accssed in the server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.urlencoded({ extended: true }));

// Database configuration
const db = require("./models");

// Connect to MongoDB
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// Routes
app.use("/api", artistRoutes);

app.use("/api", genreRoutes);

app.use("/api", movieRoutes);

app.use("/api/auth", userRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Upgrad Movie booking application development.",
  });
});

// Start server
app.listen(8085, () => {
  console.log("Server is running on port 8085");
});

// app.get("/movies", (req, res) => {
//   res.send("All Movies Data in JSON format from Mongo DB");
//   //   console.log("sent");
// });

// app.get("/genres", (req, res) => {
//   res.send("All Genres  Data in JSON format from Mongo DB");
// });

// app.get("/artists", (req, res) => {
//   res.send("All Artists  Data in JSON format from Mongo DB");
// });
