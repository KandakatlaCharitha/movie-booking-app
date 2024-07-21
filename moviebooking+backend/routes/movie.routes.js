const express = require("express");
const movieRoutes = express.Router();
const moviecontroller = require("../controllers/movie.controller");

// Route to get all movies or filtered movies based on query parameters
movieRoutes.get("/movies", moviecontroller.findAllMovies);

// Route to get a single movie by ID
movieRoutes.get("/movies/:movieid", moviecontroller.findOne);

// Route to get shows of a specific movie by movie ID
movieRoutes.get("/movies/:movieid/shows", moviecontroller.findShows);

module.exports = movieRoutes;
