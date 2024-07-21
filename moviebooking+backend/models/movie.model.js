// const mongoose = require("mongoose");

// const movieSchema = new mongoose.Schema({
//   movieid: { type: Number, unique: true },
//   title: { type: String },
//   published: { type: Boolean },
//   released: { type: Boolean },
//   poster_url: { type: String },
//   release_date: { type: Date },
//   publish_date: { type: Date },
//   artists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }],
//   genres: [{ type: String }],
//   duration: { type: Number },
//   critic_rating: { type: Number },
//   trailer_url: { type: String },
//   wiki_url: { type: String },
//   story_line: { type: String },
//   shows: [
//     {
//       id: { type: Number },
//       theatre: {
//         name: { type: String },
//         city: { type: String },
//       },
//       language: { type: String },
//       show_timing: { type: Date },
//       available_seats: { type: Number },
//       unit_price: { type: Number },
//     },
//   ],
// });

// const Movie = mongoose.model("Movie", movieSchema);

// module.exports = Movie;
const mongoose = require("mongoose");

// movie schema is created
const movie_schema = mongoose.Schema({
  movieid: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  published: {
    type: Boolean,
  },
  released: {
    type: Boolean,
  },
  poster_url: {
    type: String,
  },
  release_date: {
    type: String,
  },
  publish_date: {
    type: String,
  },
  artists: [
    {
      artistid: {
        type: String,
      },
      first_name: {
        type: String,
      },
      last_name: {
        type: String,
      },
      wiki_url: {
        type: String,
      },
      profile_url: {
        type: String,
      },
      movies: [],
    },
  ],
  genres: [],
  duration: {
    type: Number,
  },
  critic_rating: {
    type: Number,
  },
  trailer_url: {
    type: String,
  },
  wiki_url: {
    type: String,
  },
  story_line: {
    type: String,
  },
  shows: [],
});

// here schema model is created
const Movie = mongoose.model("movies", movie_schema);

module.exports = Movie;
