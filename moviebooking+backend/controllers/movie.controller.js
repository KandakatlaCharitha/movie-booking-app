// Import the Movie model
const Movie = require("../models/movie.model");

module.exports.findAllMovies = async (req, res) => {
  try {
    const { status, title, genres, artists, start_date, end_date } = req.query;
    let query = {};

    // Handle status query
    if (status) {
      if (status.toUpperCase() === "PUBLISHED") {
        query.published = true;
      } else if (status.toUpperCase() === "RELEASED") {
        query.released = true;
      }
    }

    // Handle title query
    if (title) {
      query.title = { $regex: new RegExp(title, "i") }; // Use RegExp for case-insensitive search
    }

    // Handle genres query
    if (genres) {
      const categoryArray = genres.split(",");
      query.genres = { $in: categoryArray }; // Match any of the genres
    }

    // Handle artists query
    if (artists) {
      const artistNames = artists.split(",");
      const firstNames = artistNames
        .map((name) => name.split(" ")[0])
        .filter(Boolean);
      const lastNames = artistNames
        .map((name) => name.split(" ")[1])
        .filter(Boolean);

      if (firstNames.length > 0) {
        query["artists.first_name"] = { $in: firstNames }; // Match any of the first names
      }
      if (lastNames.length > 0) {
        query["artists.last_name"] = { $in: lastNames }; // Match any of the last names
      }
    }

    // Handle date range query
    if (start_date && end_date) {
      query.release_date = {
        $gte: new Date(start_date).toISOString(),
        $lte: new Date(end_date).toISOString(),
      };
    } else if (start_date) {
      query.release_date = {
        $gte: new Date(start_date).toISOString(),
      };
    } else if (end_date) {
      query.release_date = {
        $lte: new Date(end_date).toISOString(),
      };
    }

    // Log the query for debugging
    console.log("Query:", JSON.stringify(query, null, 2));

    // Fetch movies based on query
    const movies = await Movie.find(query);

    res.status(200).json({ total: movies.length, movies });
  } catch (error) {
    console.error("Error retrieving movies:", error);
    res.status(500).json({ message: "Error retrieving movies." });
  }
};

module.exports.findOne = async (req, res) => {
  try {
    const id = parseInt(req.params.movieid, 10); // Ensure the id is a number
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid movie ID format" });
    }

    const movie = await Movie.findOne({ movieid: id });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json([movie]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to get shows for a specific movie ID
module.exports.findShows = async (req, res) => {
  try {
    const id = parseInt(req.params.movieid, 10); // Ensure the id is a number
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid movie ID format" });
    }

    const movieData = await Movie.findOne({ movieid: id });
    if (!movieData) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movieData.shows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Import the Movie model
// const Movie = require("../models/movie.model");
// module.exports.findAllMovies = async (req, res) => {
//   try {
//     const { status, title, genres, artists, start_date, end_date } = req.query;
//     let query = {};

//     // Handle status query
//     if (status) {
//       if (status.toUpperCase() === "PUBLISHED") {
//         query.published = true;
//       } else if (status.toUpperCase() === "RELEASED") {
//         query.released = true;
//       }
//     }

//     // Handle title query
//     if (title) {
//       query.title = { $regex: title, $options: "i" };
//     }

//     // Handle genres query
//     if (genres) {
//       const categoryArray = genres.split(",");
//       query.genres = { $in: categoryArray };
//     }

//     // Handle artists query
//     if (artists) {
//       const artistNames = artists.split(",");
//       const firstNames = artistNames
//         .map((name) => name.split(" ")[0])
//         .filter(Boolean);
//       const lastNames = artistNames
//         .map((name) => name.split(" ")[1])
//         .filter(Boolean);

//       if (firstNames.length > 0) {
//         query["artists.first_name"] = { $in: firstNames };
//       }
//       if (lastNames.length > 0) {
//         query["artists.last_name"] = { $in: lastNames };
//       }
//     }

//     // Handle date range query
//     if (start_date && end_date) {
//       query.release_date = {
//         $gte: new Date(start_date).toISOString(),
//         $lte: new Date(end_date).toISOString(),
//       };
//     } else if (start_date) {
//       query.release_date = {
//         $gte: new Date(start_date).toISOString(),
//       };
//     } else if (end_date) {
//       query.release_date = {
//         $lte: new Date(end_date).toISOString(),
//       };
//     }

//     // Log the query for debugging
//     console.log("Query:", JSON.stringify(query, null, 2));

//     // Fetch movies based on query
//     const movies = await Movie.find(query);

//     res.status(200).json({ total: movies.length, movies });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
